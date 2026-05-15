package com.microservices.core.common.converters;
import com.microservices.core.common.dto.enums.Language;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class LanguageConverter implements Converter<String, Language> {

    @Override
    public Language convert(String source) {
        try {
            return Language.valueOf(source.toUpperCase());
        } catch (Exception e) {
            throw new IllegalArgumentException("Idioma no soportado: " + source);
        }
    }
}