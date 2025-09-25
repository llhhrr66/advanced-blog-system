package com.blog.service;

import com.blog.domain.dto.ArticleBatchDTO;
import com.blog.domain.dto.ArticleCreateDTO;
import com.blog.domain.dto.PageDTO;
import com.blog.domain.po.Articles;
import com.baomidou.mybatisplus.extension.service.IService;
import com.blog.domain.query.PageQuery;
import com.blog.domain.vo.ArticleDetailVO;
import com.blog.dto.response.ArticleStatsResponse;

/**
 * <p>
 * 文章主表，存储博客文章的所有基础信息和内容 服务类
 * </p>
 *
 * @author 梁俊荣
 * @since 2025-09-24
 */
public interface IArticlesService extends IService<Articles> {


    PageDTO<ArticleDetailVO> getArticles(PageQuery query);

    ArticleDetailVO getArticleById(Long id);

    void addArticle(ArticleCreateDTO dto);

    void updateArticle(Long id,ArticleCreateDTO dto);

    void deleteArticle(Long id);

    void batchArticle(ArticleBatchDTO dto);

    /**
     * 获取文章统计信息
     * @return 文章统计信息
     */
    ArticleStatsResponse getArticleStats();
}
