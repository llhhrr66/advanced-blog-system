package com.blog.utils;

import com.blog.domain.dto.InterviewCategoryResponseDTO;
import com.blog.domain.dto.InterviewQuestionResponseDTO;
import com.blog.domain.entity.InterviewCategory;
import com.blog.domain.entity.InterviewQuestion;
import org.springframework.beans.BeanUtils;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 面试相关实体转换工具类
 */
public class InterviewConvertUtils {

    /**
     * 面试分类实体转响应DTO
     */
    public static InterviewCategoryResponseDTO toResponseDTO(InterviewCategory entity) {
        if (entity == null) {
            return null;
        }
        
        InterviewCategoryResponseDTO responseDTO = new InterviewCategoryResponseDTO();
        BeanUtils.copyProperties(entity, responseDTO);
        return responseDTO;
    }

    /**
     * 面试分类实体列表转响应DTO列表
     */
    public static List<InterviewCategoryResponseDTO> toResponseDTOList(List<InterviewCategory> entities) {
        if (entities == null || entities.isEmpty()) {
            return List.of();
        }
        
        return entities.stream()
                .map(InterviewConvertUtils::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * 面试题实体转响应DTO
     */
    public static InterviewQuestionResponseDTO toResponseDTO(InterviewQuestion entity) {
        if (entity == null) {
            return null;
        }
        
        InterviewQuestionResponseDTO responseDTO = new InterviewQuestionResponseDTO();
        BeanUtils.copyProperties(entity, responseDTO);
        return responseDTO;
    }

    /**
     * 面试题实体列表转响应DTO列表
     */
    public static List<InterviewQuestionResponseDTO> toQuestionResponseDTOList(List<InterviewQuestion> entities) {
        if (entities == null || entities.isEmpty()) {
            return List.of();
        }
        
        return entities.stream()
                .map(InterviewConvertUtils::toResponseDTO)
                .collect(Collectors.toList());
    }
}
