package com.blog.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.blog.common.exception.BusinessException;
import com.blog.common.result.ResultEnum;
import com.blog.domain.dto.InterviewCategoryCreateDTO;
import com.blog.domain.dto.InterviewCategoryUpdateDTO;
import com.blog.domain.dto.InterviewCategoryQueryDTO;
import com.blog.domain.entity.InterviewCategory;
import com.blog.domain.entity.InterviewQuestion;
import com.blog.mapper.InterviewCategoryMapper;
import com.blog.mapper.InterviewQuestionMapper;
import com.blog.service.IInterviewCategoryService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 面试题分类服务实现类
 */
@Service
public class InterviewCategoryServiceImpl extends ServiceImpl<InterviewCategoryMapper, InterviewCategory> 
        implements IInterviewCategoryService {
    
    @Autowired
    private InterviewCategoryMapper interviewCategoryMapper;
    
    @Autowired
    private InterviewQuestionMapper interviewQuestionMapper;
    
    @Override
    public List<InterviewCategory> getCategoryTree() {
        // 获取所有分类
        QueryWrapper<InterviewCategory> queryWrapper = new QueryWrapper<>();
        queryWrapper.orderByAsc("sort_order").orderByDesc("create_time");
        List<InterviewCategory> allCategories = interviewCategoryMapper.selectList(queryWrapper);
        
        // 构建树形结构
        List<InterviewCategory> tree = new ArrayList<>();
        Map<Long, List<InterviewCategory>> parentMap = allCategories.stream()
                .filter(cat -> cat.getParentId() != null)
                .collect(Collectors.groupingBy(InterviewCategory::getParentId));
        
        // 找出顶级分类
        for (InterviewCategory category : allCategories) {
            if (category.getParentId() == null || category.getParentId() == 0) {
                buildTree(category, parentMap);
                tree.add(category);
            }
        }
        
        return tree;
    }
    
    /**
     * 递归构建树形结构
     */
    private void buildTree(InterviewCategory parent, Map<Long, List<InterviewCategory>> parentMap) {
        List<InterviewCategory> children = parentMap.get(parent.getId());
        if (children != null && !children.isEmpty()) {
            parent.setChildren(children);
            for (InterviewCategory child : children) {
                buildTree(child, parentMap);
            }
        }
    }
    
    @Override
    public IPage<InterviewCategory> getCategoriesPage(InterviewCategoryQueryDTO queryDTO) {
        Page<InterviewCategory> page = queryDTO.toMpPageDefaultSortByCreateTimeDesc();
        
        QueryWrapper<InterviewCategory> queryWrapper = new QueryWrapper<>();
        
        // 分类名称模糊查询
        if (StringUtils.hasText(queryDTO.getCategoryName())) {
            queryWrapper.like("category_name", queryDTO.getCategoryName());
        }
        
        // 父分类ID查询
        if (queryDTO.getParentId() != null) {
            queryWrapper.eq("parent_id", queryDTO.getParentId());
        }
        
        // 状态查询
        if (queryDTO.getStatus() != null) {
            queryWrapper.eq("status", queryDTO.getStatus());
        }
        
        queryWrapper.orderByAsc("sort_order").orderByDesc("create_time");
        
        return interviewCategoryMapper.selectPage(page, queryWrapper);
    }
    
    @Override
    public InterviewCategory getCategoryById(Long id) {
        InterviewCategory category = interviewCategoryMapper.selectById(id);
        if (category == null) {
            throw new BusinessException(ResultEnum.DATA_NOT_FOUND, "分类不存在");
        }
        return category;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public InterviewCategory createCategory(InterviewCategoryCreateDTO createDTO) {
        // 检查名称是否已存在
        if (checkCategoryNameExists(createDTO.getCategoryName(), createDTO.getParentId(), null)) {
            throw new BusinessException(ResultEnum.DATA_ALREADY_EXISTS, "分类名称已存在");
        }
        
        // 创建分类实体
        InterviewCategory category = new InterviewCategory();
        category.setCategoryName(createDTO.getCategoryName());
        category.setParentId(createDTO.getParentId());
        category.setCategoryPath(createDTO.getCategoryPath());
        category.setDescription(createDTO.getDescription());
        category.setIcon(createDTO.getIcon());
        category.setSortOrder(createDTO.getSortOrder() != null ? createDTO.getSortOrder() : 0);
        category.setStatus(createDTO.getStatus() != null ? createDTO.getStatus() : 1);
        category.setCreateTime(LocalDateTime.now());
        category.setUpdateTime(LocalDateTime.now());
        category.setQuestionCount(0);
        
        // 保存到数据库
        int result = interviewCategoryMapper.insert(category);
        if (result <= 0) {
            throw new BusinessException(ResultEnum.OPERATION_FAILED, "创建分类失败");
        }
        
        return category;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public InterviewCategory updateCategory(Long id, InterviewCategoryUpdateDTO updateDTO) {
        // 验证分类是否存在
        InterviewCategory existingCategory = interviewCategoryMapper.selectById(id);
        if (existingCategory == null) {
            throw new BusinessException(ResultEnum.DATA_NOT_FOUND, "分类不存在");
        }
        
        // 如果修改了名称，检查新名称是否已存在
        if (StringUtils.hasText(updateDTO.getCategoryName()) && 
            !updateDTO.getCategoryName().equals(existingCategory.getCategoryName())) {
            if (checkCategoryNameExists(updateDTO.getCategoryName(), 
                                       updateDTO.getParentId() != null ? updateDTO.getParentId() : existingCategory.getParentId(), 
                                       id)) {
                throw new BusinessException(ResultEnum.DATA_ALREADY_EXISTS, "分类名称已存在");
            }
        }
        
        // 更新分类信息
        InterviewCategory category = new InterviewCategory();
        category.setId(id);
        if (StringUtils.hasText(updateDTO.getCategoryName())) {
            category.setCategoryName(updateDTO.getCategoryName());
        }
        if (updateDTO.getParentId() != null) {
            category.setParentId(updateDTO.getParentId());
        }
        if (updateDTO.getDescription() != null) {
            category.setDescription(updateDTO.getDescription());
        }
        if (updateDTO.getStatus() != null) {
            category.setStatus(updateDTO.getStatus());
        }
        if (updateDTO.getSortOrder() != null) {
            category.setSortOrder(updateDTO.getSortOrder());
        }
        category.setUpdateTime(LocalDateTime.now());
        
        int result = interviewCategoryMapper.updateById(category);
        if (result <= 0) {
            throw new BusinessException(ResultEnum.OPERATION_FAILED, "更新分类失败");
        }
        
        // 重新查询并返回
        return interviewCategoryMapper.selectById(id);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean deleteCategory(Long id) {
        // 验证分类是否存在
        InterviewCategory category = interviewCategoryMapper.selectById(id);
        if (category == null) {
            throw new BusinessException(ResultEnum.DATA_NOT_FOUND, "分类不存在");
        }
        
        // 检查是否有子分类
        QueryWrapper<InterviewCategory> childWrapper = new QueryWrapper<>();
        childWrapper.eq("parent_id", id);
        long childCount = interviewCategoryMapper.selectCount(childWrapper);
        if (childCount > 0) {
            throw new BusinessException(ResultEnum.OPERATION_FAILED, "该分类存在子分类，无法删除");
        }
        
        // 检查是否有关联的面试题
        QueryWrapper<InterviewQuestion> questionWrapper = new QueryWrapper<>();
        questionWrapper.eq("category_id", id);
        long questionCount = interviewQuestionMapper.selectCount(questionWrapper);
        if (questionCount > 0) {
            throw new BusinessException(ResultEnum.OPERATION_FAILED, "该分类下存在面试题，无法删除");
        }
        
        int result = interviewCategoryMapper.deleteById(id);
        if (result <= 0) {
            throw new BusinessException(ResultEnum.OPERATION_FAILED, "删除分类失败");
        }
        
        return true;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateCategoryStatus(Long id, Integer status) {
        if (status == null || (status != 0 && status != 1)) {
            throw new BusinessException(ResultEnum.PARAMETER_ERROR, "状态值无效");
        }
        
        InterviewCategory category = interviewCategoryMapper.selectById(id);
        if (category == null) {
            throw new BusinessException(ResultEnum.DATA_NOT_FOUND, "分类不存在");
        }
        
        category.setStatus(status);
        category.setUpdateTime(LocalDateTime.now());
        
        int result = interviewCategoryMapper.updateById(category);
        if (result <= 0) {
            throw new BusinessException(ResultEnum.OPERATION_FAILED, "更新分类状态失败");
        }
        
        return true;
    }
    
    @Override
    public List<InterviewCategory> getChildCategories(Long parentId) {
        QueryWrapper<InterviewCategory> queryWrapper = new QueryWrapper<>();
        if (parentId == null) {
            queryWrapper.isNull("parent_id");
        } else {
            queryWrapper.eq("parent_id", parentId);
        }
        queryWrapper.orderByAsc("sort_order").orderByDesc("create_time");
        
        return interviewCategoryMapper.selectList(queryWrapper);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateCategoryQuestionCount(Long categoryId) {
        if (categoryId == null) {
            throw new BusinessException(ResultEnum.PARAMETER_ERROR, "分类ID不能为空");
        }
        
        InterviewCategory category = interviewCategoryMapper.selectById(categoryId);
        if (category == null) {
            throw new BusinessException(ResultEnum.DATA_NOT_FOUND, "分类不存在");
        }
        
        // 统计该分类下的题目数量
        QueryWrapper<InterviewQuestion> questionWrapper = new QueryWrapper<>();
        questionWrapper.eq("category_id", categoryId);
        long count = interviewQuestionMapper.selectCount(questionWrapper);
        
        category.setQuestionCount((int) count);
        category.setUpdateTime(LocalDateTime.now());
        
        int result = interviewCategoryMapper.updateById(category);
        return result > 0;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateAllCategoryQuestionCount() {
        // 获取所有分类
        List<InterviewCategory> categories = interviewCategoryMapper.selectList(null);
        
        for (InterviewCategory category : categories) {
            // 统计每个分类下的题目数量
            QueryWrapper<InterviewQuestion> questionWrapper = new QueryWrapper<>();
            questionWrapper.eq("category_id", category.getId());
            long count = interviewQuestionMapper.selectCount(questionWrapper);
            
            category.setQuestionCount((int) count);
            category.setUpdateTime(LocalDateTime.now());
            interviewCategoryMapper.updateById(category);
        }
        
        return true;
    }
    
    @Override
    public boolean checkCategoryNameExists(String categoryName, Long parentId, Long excludeId) {
        if (!StringUtils.hasText(categoryName)) {
            return false;
        }
        
        QueryWrapper<InterviewCategory> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("category_name", categoryName);
        
        if (parentId != null) {
            queryWrapper.eq("parent_id", parentId);
        } else {
            queryWrapper.isNull("parent_id");
        }
        
        if (excludeId != null) {
            queryWrapper.ne("id", excludeId);
        }
        
        return interviewCategoryMapper.selectCount(queryWrapper) > 0;
    }
    
    @Override
    public String getCategoryPath(Long categoryId) {
        if (categoryId == null) {
            return "";
        }
        
        StringBuilder path = new StringBuilder();
        InterviewCategory category = interviewCategoryMapper.selectById(categoryId);
        
        while (category != null) {
            if (path.length() > 0) {
                path.insert(0, " / ");
            }
            path.insert(0, category.getCategoryName());
            
            if (category.getParentId() != null && category.getParentId() > 0) {
                category = interviewCategoryMapper.selectById(category.getParentId());
            } else {
                break;
            }
        }
        
        return path.toString();
    }
    
    @Override
    public List<InterviewCategory> getAllCategories() {
        QueryWrapper<InterviewCategory> queryWrapper = new QueryWrapper<>();
        queryWrapper.orderByAsc("sort_order").orderByDesc("create_time");
        return interviewCategoryMapper.selectList(queryWrapper);
    }
    
    @Override
    public List<InterviewCategory> getEnabledCategories() {
        QueryWrapper<InterviewCategory> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("status", 1);
        queryWrapper.orderByAsc("sort_order").orderByDesc("create_time");
        return interviewCategoryMapper.selectList(queryWrapper);
    }
    
    @Override
    public InterviewCategory create(InterviewCategoryCreateDTO createDTO) {
        return createCategory(createDTO);
    }
    
    @Override
    public boolean deleteById(Long id) {
        return deleteCategory(id);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean batchDelete(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return true;
        }
        
        for (Long id : ids) {
            deleteCategory(id);
        }
        
        return true;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean toggleStatus(List<Long> ids, Boolean enabled) {
        if (ids == null || ids.isEmpty()) {
            return true;
        }
        
        Integer status = enabled ? 1 : 0;
        for (Long id : ids) {
            updateCategoryStatus(id, status);
        }
        
        return true;
    }
    
    @Override
    public List<InterviewCategory> searchByName(String name) {
        if (!StringUtils.hasText(name)) {
            return new ArrayList<>();
        }
        
        QueryWrapper<InterviewCategory> queryWrapper = new QueryWrapper<>();
        queryWrapper.like("category_name", name);
        queryWrapper.orderByAsc("sort_order").orderByDesc("create_time");
        
        return interviewCategoryMapper.selectList(queryWrapper);
    }
    
    @Override
    public boolean existsByName(String name, Long excludeId) {
        if (!StringUtils.hasText(name)) {
            return false;
        }
        
        QueryWrapper<InterviewCategory> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("category_name", name);
        
        if (excludeId != null) {
            queryWrapper.ne("id", excludeId);
        }
        
        return interviewCategoryMapper.selectCount(queryWrapper) > 0;
    }
}
