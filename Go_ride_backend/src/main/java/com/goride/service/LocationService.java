package com.goride.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
public class LocationService {

    public List<Map<String, Object>> searchLocation(String query) {
        if (query == null || query.trim().isEmpty()) {
            return Collections.emptyList();
        }

        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://nominatim.openstreetmap.org/search?format=json&q=" + query + "&limit=5";
            Object[] response = restTemplate.getForObject(url, Object[].class);

            List<Map<String, Object>> results = new ArrayList<>();
            if (response != null) {
                for (Object item : response) {
                    if (item instanceof Map) {
                        Map<?, ?> map = (Map<?, ?>) item;
                        Map<String, Object> location = new HashMap<>();
                        location.put("display_name", map.get("display_name"));
                        location.put("lat", map.get("lat"));
                        location.put("lon", map.get("lon"));
                        results.add(location);
                    }
                }
            }
            if (!results.isEmpty()) {
                return results;
            }
        } catch (Exception e) {
            // fallback if Nominatim is unreachable
        }

        // Mock fallback results
        List<Map<String, Object>> fallback = new ArrayList<>();
        Map<String, Object> loc1 = new HashMap<>();
        loc1.put("display_name", query + ", City Center");
        loc1.put("lat", "23.8103");
        loc1.put("lon", "90.4125");

        Map<String, Object> loc2 = new HashMap<>();
        loc2.put("display_name", query + ", Airport Station");
        loc2.put("lat", "23.8511");
        loc2.put("lon", "90.4072");

        fallback.add(loc1);
        fallback.add(loc2);
        return fallback;
    }
}
