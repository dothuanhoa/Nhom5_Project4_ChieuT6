package com.export;

import java.net.InetSocketAddress;

import com.sun.net.httpserver.HttpServer;

public class Main {
    public static void main(String[] args) throws Exception {

        int port = Integer.parseInt(
            System.getenv().getOrDefault("PORT", "8080")
        );

        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

        server.createContext("/export", new ExportHandler());

        server.setExecutor(null);
        server.start();

        System.out.println("Server running at port " + port);
    }
}