package com.jungwook.fileserver.repository;

import com.jungwook.fileserver.domain.Metadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MetadataRepository extends JpaRepository<Metadata, UUID> {
  <T> List<T> findByTeamIdAndDeletedAtIsNull(UUID teamId, Class<T> type);
}
