-- schema.sql

CREATE DATABASE IF NOT EXISTS vanilla_makeup;
USE vanilla_makeup;

-- Eliminar tablas existentes (en orden correcto por dependencias)
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS skin_analysis;
DROP TABLE IF EXISTS recommendations;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

-- Tabla de Usuarios
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    skin_type VARCHAR(50),
    occupation VARCHAR(100),
    exposure_level VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Productos
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    skin_type VARCHAR(50),
    category VARCHAR(50),
    price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Recomendaciones
CREATE TABLE recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_id INT,
    recommendation_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Tabla de Análisis de Piel
CREATE TABLE skin_analysis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    analysis_result TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabla de Notificaciones
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    message TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

import java.util.*;

public class RecomendadorPeliculas {

    static class Pelicula {
        String titulo;
        List<String> generos;

        public Pelicula(String titulo, List<String> generos) {
            this.titulo = titulo;
            this.generos = generos;
        }
    }

    static class AgenteUsuario {
        List<String> preferenciasGeneros;

        public AgenteUsuario(List<String> preferenciasGeneros) {
            this.preferenciasGeneros = preferenciasGeneros;
        }
    }

    static class AgenteRecomendacion {
        public List<Map.Entry<String, Integer>> recomendar(List<Pelicula> peliculas, AgenteUsuario usuario) {
            Map<String, Integer> puntuaciones = new HashMap<>();

            for (Pelicula pelicula : peliculas) {
                int score = 0;
                for (String genero : pelicula.generos) {
                    if (usuario.preferenciasGeneros.contains(genero)) {
                        score++;
                    }
                }
                puntuaciones.put(pelicula.titulo, score);
            }

            List<Map.Entry<String, Integer>> listaOrdenada = new ArrayList<>(puntuaciones.entrySet());
            listaOrdenada.sort((a, b) -> b.getValue().compareTo(a.getValue()));
            return listaOrdenada;
        }
    }

    public static void main(String[] args) {
        List<Pelicula> peliculas = Arrays.asList(
            new Pelicula("Matrix", Arrays.asList("acción", "ciencia ficción")),
            new Pelicula("Titanic", Arrays.asList("romance", "drama")),
            new Pelicula("John Wick", Arrays.asList("acción", "thriller")),
            new Pelicula("Interstellar", Arrays.asList("ciencia ficción", "drama"))
        );

        AgenteUsuario usuario = new AgenteUsuario(Arrays.asList("acción", "drama"));
        AgenteRecomendacion recomendador = new AgenteRecomendacion();
        List<Map.Entry<String, Integer>> resultados = recomendador.recomendar(peliculas, usuario);

        System.out.println("Películas recomendadas:");
        for (Map.Entry<String, Integer> entrada : resultados) {
            System.out.println(entrada.getKey() + " (Puntaje: " + entrada.getValue() + ")");
        }
    }
}