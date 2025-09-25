package com.blog.utils;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.expression.EvaluationContext;
import org.springframework.expression.Expression;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
public class SPELUtils {


    /**
     * 将模板中的表达式替换成args参数中的值
     *
     * @param formatter   模板
     * @param paraNameArr 方法对应的参数名称
     * @param args        方法参数值value，用来进行退换对应的表达式
     * @return 模板替换后的字符串
     *
     * 例    format : tj:#{user.id}
     *      paraNameAddr [user]
     *      args [{"user":{"id":1}}]
     *
     *      转换后结果 -> tj:1
     */
    public static String parse(String formatter, String[] paraNameArr, Object[] args) {
        if (StringUtils.isNotBlank(formatter) && formatter.indexOf("#") > -1) {
            //正则表达式 #{user.id},
            Pattern pattern = Pattern.compile("(\\#\\{([^\\}]*)\\})");
            Matcher matcher = pattern.matcher(formatter);
            //将正则表达式中#{}的值取出放在keys中
            List<String> keys = new ArrayList<>();
            while (matcher.find()) {
                keys.add(matcher.group());
            }
            if (!CollUtils.isEmpty(keys)) {
                //SPEL表达式对象
                ExpressionParser parser = new SpelExpressionParser();
                StandardEvaluationContext context = new StandardEvaluationContext();
                //将名称和value一一对应
                for (int i = 0; i < paraNameArr.length; i++) {
                    context.setVariable(paraNameArr[i], args[i]);
                }

                for (String tmp : keys) {
                    formatter = formatter.replace(tmp,
                            //通过SPEL表达式获取对应的值，然后再替换掉原有值
                            parser.parseExpression("#" + tmp.substring(2, tmp.length() - 1)).getValue(context, String.class));
                }
                return formatter;
            }
        }
        return null;
    }

    @Data
    public static class User {
        private Long id = 1L;
    }
    /**
     * 解析SpEL表达式 - 用于AOP切面
     *
     * @param spel SpEL表达式
     * @param joinPoint 切点
     * @param returnValue 方法返回值
     * @return 解析结果
     */
    public static Object parseExpression(String spel, JoinPoint joinPoint, Object returnValue) {
        if (!StringUtils.hasText(spel)) {
            return null;
        }

        try {
            // 获取方法签名
            MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();
            Method method = methodSignature.getMethod();
            
            // 创建评估上下文
            EvaluationContext context = createContext(method, methodSignature.getParameterNames(), joinPoint.getArgs(), returnValue);
            
            // 解析表达式
            Expression expression = new SpelExpressionParser().parseExpression(spel);
            return expression.getValue(context);
        } catch (Exception e) {
            log.warn("解析SpEL表达式失败: {}", spel, e);
            return null;
        }
    }

    /**
     * 创建表达式评估上下文
     *
     * @param method 方法
     * @param paramNames 参数名数组
     * @param args 方法参数
     * @param returnValue 返回值
     * @return 评估上下文
     */
    private static EvaluationContext createContext(Method method, String[] paramNames, Object[] args, Object returnValue) {
        StandardEvaluationContext context = new StandardEvaluationContext();
        
        // 添加方法参数到上下文
        for (int i = 0; i < args.length && i < paramNames.length; i++) {
            context.setVariable(paramNames[i], args[i]);
        }
        
        // 添加方法返回值到上下文
        if (returnValue != null) {
            context.setVariable("result", returnValue);
        }
        
        // 添加特殊变量
        context.setVariable("method", method);
        context.setVariable("class", method.getDeclaringClass());
        
        // 添加当前用户信息
        try {
            Long currentUserId = UserContext.getUser();
            if (currentUserId != null) {
                context.setVariable("userId", currentUserId);
            }
        } catch (Exception e) {
            // 忽略错误
        }
        
        return context;
    }

    public static void main(String[] args) {
        Object [] users = new Object[1];
        users[0] = new User();

        System.out.println(parse("tj:#{user.id}", new String[]{"user"}, users));
    }
}
