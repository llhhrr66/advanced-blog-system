package com.blog.controller;

import com.blog.annotation.OperationLog;
import com.blog.common.Result;
import com.blog.domain.dto.ArticleBatchDTO;
import com.blog.domain.dto.ArticleCreateDTO;
import com.blog.domain.dto.PageDTO;
import com.blog.domain.query.PageQuery;
import com.blog.domain.vo.ArticleDetailVO;
import com.blog.service.IArticlesService;
import com.blog.dto.response.ArticleStatsResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * <p>
 * 文章主表，存储博客文章的所有基础信息和内容 前端控制器
 * </p>
 *
 * @author 梁俊荣
 * @since 2025-09-24
 */
@RestController
@RequestMapping("/articles")
@RequiredArgsConstructor
@Validated
public class ArticlesController {
    private final IArticlesService articlesService;

    @GetMapping
    public Result<PageDTO<ArticleDetailVO>> getArticles(@Valid PageQuery query){
        PageDTO<ArticleDetailVO> list =  articlesService.getArticles(query);
        return Result.success(list);
    }

    @GetMapping("/{id}")
    public Result<ArticleDetailVO> getArticleById(@Positive  @PathVariable Long id){
        ArticleDetailVO vo =   articlesService.getArticleById(id);
        return Result.success(vo);
    }
    @PostMapping
    @OperationLog(
            operationType = "CREATE_ARTICLE",
            description = "创建文章",
            targetType = "ARTICLE",
            recordParams = true
    )
    public Result addArticle(@Validated @RequestBody ArticleCreateDTO dto){
        articlesService.addArticle(dto);
        return Result.success();
    }
    @PutMapping("/{id}")
    @OperationLog(
            operationType = "UPDATE_ARTICLE",
            description = "更新文章",
            targetType = "ARTICLE",
            targetIdsExpression = "T(java.util.Collections).singletonList(#id)",
            recordParams = true
    )
    public Result updateArticle(@Positive @PathVariable Long id, @RequestBody ArticleCreateDTO dto){
        articlesService.updateArticle(id,dto);
        return Result.success();
    }
    @DeleteMapping("/{id}")
    @OperationLog(
            operationType = "DELETE_ARTICLE",
            description = "删除文章",
            targetType = "ARTICLE",
            targetIdsExpression = "T(java.util.Collections).singletonList(#id)",
            recordOldValue = true
    )
    public Result deleteArticle(@Positive  @PathVariable Long id){
        articlesService.deleteArticle(id);
        return Result.success();
    }
    @PostMapping("/batch")
    @OperationLog(
            operationType = "BATCH_OPERATION",
            descriptionExpression = "'批量操作: ' + #dto.operationType.desc",
            targetType = "ARTICLE",
            targetIdsExpression = "#dto.ids",
            reasonExpression = "#dto.reason",
            recordParams = true,
            level = 2
    )
    public Result batchArticle(@RequestBody ArticleBatchDTO dto){
        articlesService.batchArticle(dto);
        return Result.success();
    }
    
    /**
     * 获取文章统计信息
     * @return 文章统计数据，包括总数、已发布、草稿、浏览量等信息
     */
    @io.swagger.v3.oas.annotations.Operation(
            summary = "获取文章统计信息",
            description = "获取系统中文章的统计数据，包括总文章数、已发布数、草稿数、总浏览量、总点赞数和总评论数",
            tags = {"文章管理"}
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "获取成功",
                    content = @io.swagger.v3.oas.annotations.media.Content(
                            mediaType = "application/json",
                            schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = ArticleStatsResponse.class)
                    )
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "500",
                    description = "服务器错误"
            )
    })
    @GetMapping("/stats")
    @OperationLog(
            operationType = "VIEW_STATS",
            description = "查看文章统计信息",
            targetType = "ARTICLE",
            level = 1
    )
    public Result<ArticleStatsResponse> getStats(){
        ArticleStatsResponse stats = articlesService.getArticleStats();
        return Result.success(stats);
    }
}
