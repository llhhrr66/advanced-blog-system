package com.blog.service.impl;

import com.blog.domain.po.Articles;
import com.blog.mapper.ArticlesMapper;
import com.blog.service.IArticlesService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 文章主表，存储博客文章的所有基础信息和内容 服务实现类
 * </p>
 *
 * @author 梁俊荣
 * @since 2025-09-24
 */
@Service
public class ArticlesServiceImpl extends ServiceImpl<ArticlesMapper, Articles> implements IArticlesService {

}
