CREATE DATABASE bookingApp;

CREATE TABLE IF NOT EXISTS users (
    email TEXT PRIMARY KEY,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    phoneNumber TEXT NOT NULL,
    email TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    message TEXT NOT NULL,
    creator TEXT NOT NULL,
    FOREIGN KEY (creator) REFERENCES users(email)
);

CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    phoneNumber TEXT NOT NULL,
    email TEXT NOT NULL,
    date DATE NOT NULL,
    amount INT NOT NULL,
    cashing TEXT NOT NULL DEFAULT false,
    message TEXT NOT NULL,
    creator TEXT NOT NULL,
    FOREIGN KEY (creator) REFERENCES users(email)
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    subscriber TEXT NOT NULL,
    creator TEXT NOT NULL,
    FOREIGN KEY (creator) REFERENCES users(email)
);

CREATE TABLE IF NOT EXISTS podcasts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    creator TEXT NOT NULL,
    type TEXT DEFAULT 'public',
    createAt TIMESTAMP NOT NULL,
    FOREIGN KEY (creator) REFERENCES users(email)
);
