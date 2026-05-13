package com.microservices.order.idempotency.aop;

import com.microservices.order.idempotency.service.IdempotencyService;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.stereotype.Component;

@Slf4j
@Aspect
@Component
public class IdempotencyAspect {

    private final IdempotencyService idempotencyService;

    private final ExpressionParser parser =
            new SpelExpressionParser();

    public IdempotencyAspect(
            IdempotencyService idempotencyService
    ) {
        this.idempotencyService = idempotencyService;
    }

    @Around("@annotation(idempotency)")
    public Object handleIdempotency(
            ProceedingJoinPoint joinPoint,
            Idempotency idempotency
    ) throws Throwable {

        MethodSignature signature =
                (MethodSignature) joinPoint.getSignature();

        Object[] args = joinPoint.getArgs();
        String[] paramNames = signature.getParameterNames();

        String key = idempotency.key();

        Object eventIdValue;

        // =========================
        // MODO SPEL
        // =========================
        if (key.startsWith("#")) {

            StandardEvaluationContext context =
                    new StandardEvaluationContext();

            for (int i = 0; i < paramNames.length; i++) {
                context.setVariable(paramNames[i], args[i]);

                // soporte #p0 #p1
                context.setVariable("p" + i, args[i]);

                // soporte #a0 #a1
                context.setVariable("a" + i, args[i]);
            }

            eventIdValue =
                    parser.parseExpression(key)
                            .getValue(context);

        }

        // =========================
        // MODO PARAM SIMPLE
        // =========================
        else {

            eventIdValue = null;

            for (int i = 0; i < paramNames.length; i++) {

                if (paramNames[i].equals(key)) {
                    eventIdValue = args[i];
                    break;
                }
            }
        }

        if (eventIdValue == null) {
            throw new IllegalArgumentException(
                    "No se pudo resolver el eventId"
            );
        }

        String eventId = eventIdValue.toString();


        idempotencyService.checkAndSaveEvent(
                eventId,
                idempotency.eventType(),
                idempotency.source()
        );



        return joinPoint.proceed();
    }
}