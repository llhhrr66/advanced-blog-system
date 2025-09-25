package com.blog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.blog.domain.entity.InterviewCategory;
import org.apache.ibatis.annotations.Mapper;

/**
 * 面试题分类Mapper接口
 */
@Mapper
public interface InterviewCategoryMapper extends BaseMapper<InterviewCategory> {
}
