package com.blog.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.blog.domain.entity.InterviewCategory;
import com.blog.domain.dto.InterviewCategoryCreateDTO;
import com.blog.domain.dto.InterviewCategoryUpdateDTO;
import com.blog.domain.dto.InterviewCategoryQueryDTO;

import java.util.List;

/**
 * 面试题分类服务接口
 */
public interface IInterviewCategoryService extends IService<InterviewCategory> {

    /**
     * 获取分类树形结构
     */
    List<InterviewCategory> getCategoryTree();

    /**
     * 分页查询分类列表
     */
    IPage<InterviewCategory> getCategoriesPage(InterviewCategoryQueryDTO queryDTO);

    /**
     * 根据ID获取分类详情
     */
    InterviewCategory getCategoryById(Long id);

    /**
     * 创建分类
     */
    InterviewCategory createCategory(InterviewCategoryCreateDTO createDTO);

    /**
     * 更新分类
     */
    InterviewCategory updateCategory(Long id, InterviewCategoryUpdateDTO updateDTO);

    /**
     * 删除分类
     */
    boolean deleteCategory(Long id);

    /**
     * 更新分类状态
     */
    boolean updateCategoryStatus(Long id, Integer status);

    /**
     * 获取子分类列表
     */
    List<InterviewCategory> getChildCategories(Long parentId);

    /**
     * 更新分类题目数量
     */
    boolean updateCategoryQuestionCount(Long categoryId);

    /**
     * 批量更新分类题目数量
     */
    boolean updateAllCategoryQuestionCount();

    /**
     * 检查分类名称是否存在
     */
    boolean checkCategoryNameExists(String categoryName, Long parentId, Long excludeId);

    /**
     * 获取分类层级路径
     */
    String getCategoryPath(Long categoryId);
    
    /**
     * 获取所有分类列表
     */
    List<InterviewCategory> getAllCategories();
    
    /**
     * 获取启用的分类列表
     */
    List<InterviewCategory> getEnabledCategories();
    
    /**
     * 创建分类（接收DTO参数）
     */
    InterviewCategory create(InterviewCategoryCreateDTO createDTO);
    
    /**
     * 根据ID删除分类
     */
    boolean deleteById(Long id);
    
    /**
     * 批量删除分类
     */
    boolean batchDelete(List<Long> ids);
    
    /**
     * 切换分类状态
     */
    boolean toggleStatus(List<Long> ids, Boolean enabled);
    
    /**
     * 根据名称搜索分类
     */
    List<InterviewCategory> searchByName(String name);
    
    /**
     * 检查名称是否存在
     */
    boolean existsByName(String name, Long excludeId);
}
