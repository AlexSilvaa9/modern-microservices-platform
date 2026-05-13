package com.microservices.order.idempotency.aop;

import java.lang.annotation.*;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Idempotency {

    String key();

    String eventType() default "";

    String source() default "";
}