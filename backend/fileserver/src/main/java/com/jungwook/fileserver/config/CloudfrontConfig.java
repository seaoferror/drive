package com.jungwook.fileserver.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.services.cloudfront.CloudFrontUtilities;

@Configuration
public class CloudfrontConfig {
  @Bean
  public CloudFrontUtilities cloudFrontUtilities() {
    return CloudFrontUtilities.create();
  }
}
