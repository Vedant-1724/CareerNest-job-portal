package com.careernest.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CompanyRequest {

    @NotBlank(message = "Company name is required")
    @Size(max = 150)
    private String name;

    @Size(max = 2000)
    private String description;

    private String website;
    private String logoUrl;
    private String location;
    private String industry;
    private String companySize;
}
