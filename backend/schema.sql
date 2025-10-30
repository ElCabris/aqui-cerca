-- Tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    points INT DEFAULT 0 NOT NULL
);

-- ENUM para estados de locales
CREATE TYPE local_state AS ENUM ('active', 'pending', 'idle');

-- Tabla de locales
CREATE TABLE locals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    physical_address VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    qr_code_id VARCHAR(50) UNIQUE NOT NULL,
    state local_state DEFAULT 'pending' NOT NULL,
    -- Asociación con usuario propietario (uno a uno)
    owner_email VARCHAR(150) UNIQUE NOT NULL REFERENCES users(email)
);

-- Tabla de categorías
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Relación N:M entre locales y categorías
CREATE TABLE categories_locals (
    local_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (local_id, category_id),
    FOREIGN KEY (local_id) REFERENCES locals(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- ENUM para días de la semana
CREATE TYPE day_of_week AS ENUM (
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
);

-- Tabla de productos
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    local_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (local_id) REFERENCES locals(id)
);

-- Horarios de apertura/cierre de cada local
CREATE TABLE schedules (
    id SERIAL PRIMARY KEY,
    local_id INT NOT NULL,
    day_of_week day_of_week NOT NULL,
    opening_time TIME NOT NULL,
    closing_time TIME NOT NULL,
    FOREIGN KEY (local_id) REFERENCES locals(id),
    CHECK (opening_time < closing_time)
);

-- Tipos de acciones (ej: compra, escaneo, etc.)
CREATE TABLE actions_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Transacciones de puntos de fidelización
CREATE TABLE loyalty_transactions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    local_id INT NOT NULL,
    points_earned INT NOT NULL DEFAULT 0,
    scan_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    action_type_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (local_id) REFERENCES locals(id),
    FOREIGN KEY (action_type_id) REFERENCES actions_type(id)
);

CREATE OR REPLACE FUNCTION insert_user(
    p_name VARCHAR,
    p_email VARCHAR,
    p_password_hash VARCHAR
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    new_user_id INTEGER;
    v_qr_code_id VARCHAR(50);
BEGIN
    INSERT INTO users (name, email, password_hash)
    VALUES (p_name, p_email, p_password_hash)
    RETURNING id INTO new_user_id;

    -- Generar un identificador simple y único para QR (ajústalo si usas uuid-ossp)
    v_qr_code_id := substring(md5(random()::text || clock_timestamp()::text) from 1 for 20);

    -- Crear el negocio asociado al nuevo usuario
    INSERT INTO locals (
        name,
        description,
        physical_address,
        latitude,
        longitude,
        qr_code_id,
        owner_email
    ) VALUES (
        '',                -- name (placeholder; el usuario lo podrá actualizar)
        NULL,              -- description (opcional)
        '',                -- physical_address (placeholder)
        0,                 -- latitude (placeholder)
        0,                 -- longitude (placeholder)
        v_qr_code_id,      -- qr_code_id generado
        p_email            -- owner_email enlazado al usuario creado
    );

    RETURN new_user_id;

END;
$$;

CREATE OR REPLACE FUNCTION get_password_hash(p_email VARCHAR)
RETURNS TEXT AS $$
DECLARE
  stored_hash TEXT;
BEGIN
  SELECT password_hash INTO stored_hash 
  FROM users 
  WHERE email = p_email;
  
  RETURN stored_hash;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
