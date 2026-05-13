-- Vaciar tabla antes de insertar
DELETE FROM product;

-- Insertar productos con UUID e imágenes reales placeholder
INSERT INTO product (id, name, description, price, category, image_url, active) VALUES
('11111111-1111-1111-1111-111111111111','Laptop Dell XPS 13','Ultrabook potente y ligero con pantalla 13.3 pulgadas',1299.99,'Electronics','https://picsum.photos/seed/laptop/400/300',true),

('22222222-2222-2222-2222-222222222222','iPhone 14 Pro','Smartphone premium con cámara profesional',999.99,'Electronics','https://picsum.photos/seed/iphone/400/300',true),

('33333333-3333-3333-3333-333333333333','Auriculares Sony WH-1000XM4','Auriculares inalámbricos con cancelación de ruido',349.99,'Electronics','https://picsum.photos/seed/headphones/400/300',true),

('44444444-4444-4444-4444-444444444444','Camiseta Nike Dri-FIT','Camiseta deportiva de alta calidad',29.99,'Clothing','https://picsum.photos/seed/tshirt/400/300',true),

('55555555-5555-5555-5555-555555555555','Zapatillas Adidas Ultraboost','Zapatillas de running profesionales',179.99,'Footwear','https://picsum.photos/seed/shoes/400/300',true),

('66666666-6666-6666-6666-666666666666','Libro Clean Code','Guía esencial para desarrolladores de software',39.99,'Books','https://picsum.photos/seed/book/400/300',true),

('77777777-7777-7777-7777-777777777777','Cafetera Nespresso','Cafetera automática para café espresso',199.99,'Home','https://picsum.photos/seed/coffee/400/300',true),

('88888888-8888-8888-8888-888888888888','Monitor Samsung 27','Monitor 4K para gaming y productividad',399.99,'Electronics','https://picsum.photos/seed/monitor/400/300',true),

('99999999-9999-9999-9999-999999999999','Teclado Mecánico Corsair','Teclado gaming con switches mecánicos',149.99,'Electronics','https://picsum.photos/seed/keyboard/400/300',true),

('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Mochila de Viaje','Mochila resistente para aventuras',79.99,'Travel','https://picsum.photos/seed/backpack/400/300',true),

('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','Reloj Inteligente Apple Watch','Reloj inteligente con monitor de salud',399.99,'Electronics','https://picsum.photos/seed/watch/400/300',true),

('cccccccc-cccc-cccc-cccc-cccccccccccc','Silla Ergonómica de Oficina','Silla cómoda para largas jornadas',249.99,'Furniture','https://picsum.photos/seed/chair/400/300',true),

('dddddddd-dddd-dddd-dddd-dddddddddddd','Smart TV LG 55','Televisor 4K con HDR y conectividad',699.99,'Electronics','https://picsum.photos/seed/tv/400/300',true),

('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','Tablet Samsung Galaxy Tab','Tablet versátil para trabajo y entretenimiento',499.99,'Electronics','https://picsum.photos/seed/tablet/400/300',true),

('ffffffff-ffff-ffff-ffff-ffffffffffff','Botella Reutilizable Hydro Flask','Botella de acero inoxidable 750ml',39.99,'Home','https://picsum.photos/seed/bottle/400/300',true);