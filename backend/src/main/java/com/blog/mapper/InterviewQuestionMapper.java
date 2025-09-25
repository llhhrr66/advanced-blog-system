package com.blog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.blog.domain.entity.InterviewQuestion;
import org.apache.ibatis.annotations.Mapper;

/**
 * 面试题Mapper接口
 */
@Mapper
public interface InterviewQuestionMapper extends BaseMapper<InterviewQuestion> {
}
