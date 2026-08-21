package com.jungwook.fileserver.repository;

import com.jungwook.fileserver.domain.BlockedExtension;
import com.jungwook.fileserver.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BlockedExtensionRepository extends JpaRepository<BlockedExtension, UUID> {
  <T> List<T> findByTeamIdAndDeletedAtIsNull(UUID teamId, Class<T> type);

  boolean existsByNameAndDeletedAtIsNullAndTeamId(String name, UUID teamId);

  @Query("SELECT e.name FROM BlockedExtension e WHERE e.id = :extensionId")
  String findNameByExtensionId(@Param("extensionId") UUID extensionId);

  @Query("SELECT e.team.id FROM BlockedExtension e WHERE e.id = :extensionId")
  Optional<UUID> findTeamIdByExtensionId(@Param("extensionId") UUID extensionId);

  @Modifying(clearAutomatically = true)
  @Query("UPDATE BlockedExtension b SET b.deletedAt = :deletedAt, b.deletedBy = :deletedBy WHERE b.id = :extensionId")
  void softDeleteById(
      @Param("extensionId") UUID extensionId,
      @Param("deletedAt") Instant deletedAt,
      @Param("deletedBy") Member deletedBy
  );
}
