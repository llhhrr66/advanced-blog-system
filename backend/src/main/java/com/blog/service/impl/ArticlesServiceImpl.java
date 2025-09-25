package com.blog.service.impl;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.blog.common.Result;
import com.blog.domain.dto.ArticleBatchDTO;
import com.blog.domain.dto.ArticleCreateDTO;
import com.blog.domain.dto.PageDTO;
import com.blog.domain.po.Articles;
import com.blog.domain.query.PageQuery;
import com.blog.domain.vo.ArticleDetailVO;
import com.blog.enums.OperationType;
import com.blog.mapper.ArticlesMapper;
import com.blog.service.IArticlesService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.blog.utils.BeanUtils;
import com.blog.dto.response.ArticleStatsResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * <p>
 * 文章主表，存储博客文章的所有基础信息和内容 服务实现类
 * </p>
 *
 * @author 梁俊荣
 * @since 2025-09-24
 */
@Slf4j
@Service
public class ArticlesServiceImpl extends ServiceImpl<ArticlesMapper, Articles> implements IArticlesService {

    @Override
    public PageDTO<ArticleDetailVO> getArticles(PageQuery query) {
        Page<Articles> page = lambdaQuery().page(query.toMpPageDefaultSortByCreateTimeDesc());
        List<Articles> records = page.getRecords();
        List<ArticleDetailVO> list = BeanUtils.copyList(records, ArticleDetailVO.class);
        return PageDTO.of(page,list);
    }

    @Override
    public ArticleDetailVO getArticleById(Long id) {
        Articles vo = getById(id);
        if (vo==null){
            throw new RuntimeException("文章不存在");
        }
        ArticleDetailVO detailVO = BeanUtils.copyBean(vo, ArticleDetailVO.class);
        return detailVO;
    }

    @Override
    public void addArticle(ArticleCreateDTO dto) {
        Articles articles = BeanUtils.copyBean(dto, Articles.class);
        articles.setAuthorId(1L);
        save(articles);
    }

    @Override
    public void updateArticle(Long id,ArticleCreateDTO dto) {
        //todo 判断登录人是否为本人或者管理员
        //是直接修改
        Articles articles = BeanUtils.copyBean(dto, Articles.class);
        updateById(articles);
    }

    @Override
    public void deleteArticle(Long id) {
        //todo 判断登录人是否为本人或者管理员
        //是
        Articles byId = getById(id);
        if (byId==null){
            throw new RuntimeException("文章不存在");
        }
        removeById(byId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void batchArticle(ArticleBatchDTO dto) {
        //todo 判断是否为管理员
        //是,获取批量操作的类型
        OperationType type = dto.getOperationType();
        List<Long> articleIds = dto.getIds();
        
        // 验证文章ID列表不为空
        if (articleIds == null || articleIds.isEmpty()) {
            throw new RuntimeException("文章ID列表不能为空");
        }
        
        switch (type) {
            case BATCH_DELETE:
                // 批量删除
                batchDelete(articleIds, dto.getReason());
                break;
                
            case BATCH_PUBLISH:
                // 批量发布
                batchPublish(articleIds, dto.getPublishTime(), dto.getReason());
                break;
                
            case BATCH_UNPUBLISH:
                // 批量下架
                batchUnpublish(articleIds, dto.getReason());
                break;
                
            case BATCH_SET_TOP:
                // 批量置顶
                batchSetTop(articleIds, dto.getReason());
                break;
                
            case BATCH_CANCEL_TOP:
                // 取消置顶
                batchCancelTop(articleIds, dto.getReason());
                break;
                
            case BATCH_SET_FEATURED:
                // 批量精选
                batchSetFeatured(articleIds, dto.getReason());
                break;
                
            case BATCH_CANCEL_FEATURED:
                // 取消精选
                batchCancelFeatured(articleIds, dto.getReason());
                break;
                
            case CATEGORY_MOVE:
                // 分类移动
                if (dto.getTargetCategoryId() == null) {
                    throw new RuntimeException("目标分类 ID不能为空");
                }
                batchMoveCategory(articleIds, dto.getTargetCategoryId(), dto.getReason());
                break;
                
            default:
                throw new RuntimeException("不支持的操作类型: " + type.getDesc());
        }
    }

    /**
     * 批量删除文章
     * @param articleIds 文章ID列表
     * @param reason 操作原因
     */
    private void batchDelete(List<Long> articleIds, String reason) {
        if (articleIds == null || articleIds.isEmpty()) {
            throw new RuntimeException("文章ID列表不能为空");
        }

        // 1. 验证文章是否存在
        List<Articles> existingArticles = lambdaQuery()
                .in(Articles::getId, articleIds)
                .eq(Articles::getDeleted, false) // 只查询未删除的文章
                .list();

        if (existingArticles.isEmpty()) {
            throw new RuntimeException("未找到可删除的文章");
        }

        // 2. TODO: 检查权限（是否为作者或管理员）
        // Long currentUserId = UserContext.getUser();
        // 检查当前用户是否为文章作者或管理员

        // 3. 执行逻辑删除（更新deleted字段）
        List<Long> validIds = existingArticles.stream()
                .map(Articles::getId)
                .toList();

        boolean result = lambdaUpdate()
                .in(Articles::getId, validIds)
                .set(Articles::getDeleted, true)
                .set(Articles::getUpdateTime, LocalDateTime.now())
                .update();

        if (!result) {
            throw new RuntimeException("批量删除失败");
        }

        log.info("批量删除成功，影响记录数：{}，原因：{}", validIds.size(), reason);
    }

    /**
     * 批量发布文章
     * @param articleIds 文章ID列表
     * @param publishTime 发布时间（可为空，默认当前时间）
     * @param reason 操作原因
     */
    private void batchPublish(List<Long> articleIds, LocalDateTime publishTime, String reason) {
        if (articleIds == null || articleIds.isEmpty()) {
            throw new RuntimeException("文章ID列表不能为空");
        }

        // 1. 验证文章是否存在且状态允许发布（草稿或下架状态）
        List<Articles> existingArticles = lambdaQuery()
                .in(Articles::getId, articleIds)
                .eq(Articles::getDeleted, false)
                .in(Articles::getStatus, 0, 2) // 0-草稿，2-已下架
                .list();

        if (existingArticles.isEmpty()) {
            throw new RuntimeException("未找到可发布的文章");
        }

        // 2. 设置发布时间（为空则使用当前时间）
        LocalDateTime actualPublishTime = publishTime != null ? publishTime : LocalDateTime.now();

        // 3. 更新文章状态为已发布（1）
        List<Long> validIds = existingArticles.stream()
                .map(Articles::getId)
                .toList();

        boolean result = lambdaUpdate()
                .in(Articles::getId, validIds)
                .set(Articles::getStatus, 1) // 1-已发布
                .set(Articles::getPublishTime, actualPublishTime)
                .set(Articles::getUpdateTime, LocalDateTime.now())
                .update();

        if (!result) {
            throw new RuntimeException("批量发布失败");
        }

        log.info("批量发布成功，影响记录数：{}，发布时间：{}，原因：{}", 
                validIds.size(), actualPublishTime, reason);
    }

    /**
     * 批量下架文章
     * @param articleIds 文章ID列表
     * @param reason 操作原因
     */
    private void batchUnpublish(List<Long> articleIds, String reason) {
        if (articleIds == null || articleIds.isEmpty()) {
            throw new RuntimeException("文章ID列表不能为空");
        }

        // 1. 验证文章是否存在且当前状态为已发布
        List<Articles> existingArticles = lambdaQuery()
                .in(Articles::getId, articleIds)
                .eq(Articles::getDeleted, false)
                .eq(Articles::getStatus, 1) // 1-已发布
                .list();

        if (existingArticles.isEmpty()) {
            throw new RuntimeException("未找到可下架的文章");
        }

        // 2. 更新文章状态为已下架（2）
        List<Long> validIds = existingArticles.stream()
                .map(Articles::getId)
                .toList();

        boolean result = lambdaUpdate()
                .in(Articles::getId, validIds)
                .set(Articles::getStatus, 2) // 2-已下架
                .set(Articles::getUpdateTime, LocalDateTime.now())
                .update();

        if (!result) {
            throw new RuntimeException("批量下架失败");
        }

        log.info("批量下架成功，影响记录数：{}，原因：{}", validIds.size(), reason);
    }

    /**
     * 批量设置置顶
     * @param articleIds 文章ID列表
     * @param reason 操作原因
     */
    private void batchSetTop(List<Long> articleIds, String reason) {
        if (articleIds == null || articleIds.isEmpty()) {
            throw new RuntimeException("文章ID列表不能为空");
        }

        // 1. 验证文章是否存在且未置顶
        List<Articles> existingArticles = lambdaQuery()
                .in(Articles::getId, articleIds)
                .eq(Articles::getDeleted, false)
                .eq(Articles::getIsTop, false) // 未置顶
                .list();

        if (existingArticles.isEmpty()) {
            throw new RuntimeException("未找到可置顶的文章");
        }

        // 2. 更新文章isTop字段为true
        List<Long> validIds = existingArticles.stream()
                .map(Articles::getId)
                .toList();

        // 3. TODO: 考虑置顶文章数量限制（可选）
        // 可以在这里添加逻辑检查当前置顶文章总数是否超过限制

        boolean result = lambdaUpdate()
                .in(Articles::getId, validIds)
                .set(Articles::getIsTop, true)
                .set(Articles::getUpdateTime, LocalDateTime.now())
                .update();

        if (!result) {
            throw new RuntimeException("批量置顶失败");
        }

        log.info("批量置顶成功，影响记录数：{}，原因：{}", validIds.size(), reason);
    }

    /**
     * 批量取消置顶
     * @param articleIds 文章ID列表
     * @param reason 操作原因
     */
    private void batchCancelTop(List<Long> articleIds, String reason) {
        if (articleIds == null || articleIds.isEmpty()) {
            throw new RuntimeException("文章ID列表不能为空");
        }

        // 1. 验证文章是否存在且已置顶
        List<Articles> existingArticles = lambdaQuery()
                .in(Articles::getId, articleIds)
                .eq(Articles::getDeleted, false)
                .eq(Articles::getIsTop, true) // 已置顶
                .list();

        if (existingArticles.isEmpty()) {
            throw new RuntimeException("未找到可取消置顶的文章");
        }

        // 2. 更新文章isTop字段为false
        List<Long> validIds = existingArticles.stream()
                .map(Articles::getId)
                .toList();

        boolean result = lambdaUpdate()
                .in(Articles::getId, validIds)
                .set(Articles::getIsTop, false)
                .set(Articles::getUpdateTime, LocalDateTime.now())
                .update();

        if (!result) {
            throw new RuntimeException("批量取消置顶失败");
        }

        log.info("批量取消置顶成功，影响记录数：{}，原因：{}", validIds.size(), reason);
    }

    /**
     * 批量设置精选
     * @param articleIds 文章ID列表
     * @param reason 操作原因
     */
    private void batchSetFeatured(List<Long> articleIds, String reason) {
        if (articleIds == null || articleIds.isEmpty()) {
            throw new RuntimeException("文章ID列表不能为空");
        }

        // 1. 验证文章是否存在且未精选
        List<Articles> existingArticles = lambdaQuery()
                .in(Articles::getId, articleIds)
                .eq(Articles::getDeleted, false)
                .ne(Articles::getIsRecommend, 1) // 未精选 (假设1为精选)
                .list();

        if (existingArticles.isEmpty()) {
            throw new RuntimeException("未找到可精选的文章");
        }

        // 2. 更新文章isRecommend字段为1(精选)
        List<Long> validIds = existingArticles.stream()
                .map(Articles::getId)
                .toList();

        // 3. TODO: 考虑精选文章数量限制（可选）
        // 可以在这里添加逻辑检查当前精选文章总数是否超过限制

        boolean result = lambdaUpdate()
                .in(Articles::getId, validIds)
                .set(Articles::getIsRecommend, 1) // 1-精选
                .set(Articles::getUpdateTime, LocalDateTime.now())
                .update();

        if (!result) {
            throw new RuntimeException("批量设置精选失败");
        }

        log.info("批量设置精选成功，影响记录数：{}，原因：{}", validIds.size(), reason);
    }

    /**
     * 批量取消精选
     * @param articleIds 文章ID列表
     * @param reason 操作原因
     */
    private void batchCancelFeatured(List<Long> articleIds, String reason) {
        if (articleIds == null || articleIds.isEmpty()) {
            throw new RuntimeException("文章ID列表不能为空");
        }

        // 1. 验证文章是否存在且已精选
        List<Articles> existingArticles = lambdaQuery()
                .in(Articles::getId, articleIds)
                .eq(Articles::getDeleted, false)
                .eq(Articles::getIsRecommend, 1) // 已精选
                .list();

        if (existingArticles.isEmpty()) {
            throw new RuntimeException("未找到可取消精选的文章");
        }

        // 2. 更新文章isRecommend字段为0(普通)
        List<Long> validIds = existingArticles.stream()
                .map(Articles::getId)
                .toList();

        boolean result = lambdaUpdate()
                .in(Articles::getId, validIds)
                .set(Articles::getIsRecommend, 0) // 0-普通
                .set(Articles::getUpdateTime, LocalDateTime.now())
                .update();

        if (!result) {
            throw new RuntimeException("批量取消精选失败");
        }

        log.info("批量取消精选成功，影响记录数：{}，原因：{}", validIds.size(), reason);
    }

    /**
     * 批量移动文章分类
     * @param articleIds 文章ID列表
     * @param targetCategoryId 目标分类ID
     * @param reason 操作原因
     */
    private void batchMoveCategory(List<Long> articleIds, Long targetCategoryId, String reason) {
        if (articleIds == null || articleIds.isEmpty()) {
            throw new RuntimeException("文章ID列表不能为空");
        }

        if (targetCategoryId == null) {
            throw new RuntimeException("目标分类ID不能为空");
        }

        // 1. 验证文章是否存在
        List<Articles> existingArticles = lambdaQuery()
                .in(Articles::getId, articleIds)
                .eq(Articles::getDeleted, false)
                .ne(Articles::getCategoryId, targetCategoryId) // 排除已在目标分类中的文章
                .list();

        if (existingArticles.isEmpty()) {
            throw new RuntimeException("未找到需要移动分类的文章");
        }

        // 2. TODO: 验证目标分类是否存在且可用
        // 这里可以添加对分类表的查询验证
        // Category targetCategory = categoryService.getById(targetCategoryId);
        // if (targetCategory == null || targetCategory.getStatus() != 1) {
        //     throw new RuntimeException("目标分类不存在或不可用");
        // }

        // 3. 更新文章categoryId字段
        List<Long> validIds = existingArticles.stream()
                .map(Articles::getId)
                .toList();

        boolean result = lambdaUpdate()
                .in(Articles::getId, validIds)
                .set(Articles::getCategoryId, targetCategoryId)
                .set(Articles::getUpdateTime, LocalDateTime.now())
                .update();

        if (!result) {
            throw new RuntimeException("批量移动分类失败");
        }

        // 4. TODO: 更新原分类和目标分类的文章计数
        // 这里可以添加逻辑更新各个分类的文章数量统计

        log.info("批量移动分类成功，影响记录数：{}，目标分类ID：{}，原因：{}", 
                validIds.size(), targetCategoryId, reason);
    }
    
    @Override
    public ArticleStatsResponse getArticleStats() {
        try {
            // 统计总文章数（未删除的文章）
            Integer total = Math.toIntExact(lambdaQuery()
                    .eq(Articles::getDeleted, false)
                    .count());
            
            // 统计已发布文章数量 (status=1且未删除)
            Integer published = Math.toIntExact(lambdaQuery()
                    .eq(Articles::getStatus, 1)
                    .eq(Articles::getDeleted, false)
                    .count());
            
            // 统计草稿数量 (status=0且未删除)
            Integer draft = Math.toIntExact(lambdaQuery()
                    .eq(Articles::getStatus, 0)
                    .eq(Articles::getDeleted, false)
                    .count());
            
            // 获取所有未删除文章用于聚合统计
            List<Articles> allArticles = lambdaQuery()
                    .eq(Articles::getDeleted, false)
                    .select(Articles::getViewCount, Articles::getLikeCount, Articles::getCommentCount)
                    .list();
            
            // 手动聚合统计（避免数据库聚合函数的空值问题）
            Long totalViews = allArticles.stream()
                    .mapToLong(article -> article.getViewCount() != null ? article.getViewCount() : 0L)
                    .sum();
            
            Long totalLikes = allArticles.stream()
                    .mapToLong(article -> article.getLikeCount() != null ? article.getLikeCount() : 0L)
                    .sum();
            
            Long totalComments = allArticles.stream()
                    .mapToLong(article -> article.getCommentCount() != null ? article.getCommentCount() : 0L)
                    .sum();
            
            log.info("文章统计完成 - 总数：{}，已发布：{}，草稿：{}，总浏览：{}，总点赞：{}，总评论：{}",
                    total, published, draft, totalViews, totalLikes, totalComments);
            
            return new ArticleStatsResponse(
                    total, published, draft, totalViews, totalLikes, totalComments);
                    
        } catch (Exception e) {
            log.error("获取文章统计信息失败", e);
            // 返回默认统计数据，避免接口报错
            return new ArticleStatsResponse(0, 0, 0, 0L, 0L, 0L);
        }
    }
}
