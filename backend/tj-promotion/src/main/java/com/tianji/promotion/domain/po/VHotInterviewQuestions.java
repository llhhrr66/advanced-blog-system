package com.tianji.promotion.domain.po;

import java.math.BigDecimal;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.IdType;
import java.time.LocalDateTime;
import com.baomidou.mybatisplus.annotation.TableId;
import java.io.Serializable;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * VIEW
 * </p>
 *
 * @author 梁俊荣
 * @since 2025-09-24
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("v_hot_interview_questions")
@ApiModel(value="VHotInterviewQuestions对象", description="VIEW")
public class VHotInterviewQuestions implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    @ApiModelProperty(value = "é¢˜ç›®æ ‡é¢˜")
    private String title;

    @ApiModelProperty(value = "é¢˜ç›®å†…å®¹")
    private String content;

    @ApiModelProperty(value = "é¢˜åž‹: 1-é€‰æ‹© 2-ç®€ç­” 3-ç¼–ç¨‹ 4-è®¾è®¡")
    private Integer questionType;

    @ApiModelProperty(value = "å‚è€ƒç­”æ¡ˆ")
    private String answer;

    @ApiModelProperty(value = "ç­”æ¡ˆè§£æž")
    private String analysis;

    @ApiModelProperty(value = "ä»£ç ç¤ºä¾‹")
    private String codeExample;

    @ApiModelProperty(value = "éš¾åº¦: 1-ç®€å• 2-ä¸­ç­‰ 3-å›°éš¾")
    private Integer difficulty;

    @ApiModelProperty(value = "åˆ†ç±»ID")
    private Long categoryId;

    @ApiModelProperty(value = "å‡ºçŽ°é¢‘çŽ‡(1-100)")
    private Integer frequency;

    @ApiModelProperty(value = "é‡è¦ç¨‹åº¦(1-100)")
    private Integer importance;

    @ApiModelProperty(value = "å‡ºé¢˜å…¬å¸åˆ—è¡¨")
    private String companies;

    @ApiModelProperty(value = "çŸ¥è¯†ç‚¹åˆ—è¡¨")
    private String knowledgePoints;

    @ApiModelProperty(value = "æµè§ˆæ¬¡æ•°")
    private Long viewCount;

    @ApiModelProperty(value = "æ”¶è—æ¬¡æ•°")
    private Long collectCount;

    @ApiModelProperty(value = "ç­”é¢˜æ¬¡æ•°")
    private Long attemptCount;

    @ApiModelProperty(value = "æ­£ç¡®çŽ‡")
    private BigDecimal correctRate;

    @ApiModelProperty(value = "å¹³å‡ç”¨æ—¶(ç§’)")
    private Integer averageTime;

    @ApiModelProperty(value = "çŠ¶æ€: 0-å¾…å®¡æ ¸ 1-å·²å‘å¸ƒ 2-å·²ä¸‹æž¶")
    private Integer status;

    @ApiModelProperty(value = "åˆ›å»ºäººID")
    private Long creatorId;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;

    private Integer deleted;

    @ApiModelProperty(value = "åˆ†ç±»åç§°")
    private String categoryName;


}
