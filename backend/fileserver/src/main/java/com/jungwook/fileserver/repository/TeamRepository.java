package com.jungwook.fileserver.repository;

import com.jungwook.fileserver.domain.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TeamRepository extends JpaRepository<Team, UUID> {

  @Query("SELECT t.numberOfBlockedCustomExtensions FROM Team t WHERE t.id = :teamId")
  Integer findNumberOfBlockedCustomExtensionsById(@Param("teamId") UUID teamId);

  @Modifying(clearAutomatically = true)
  @Query("UPDATE Team t SET t.numberOfBlockedCustomExtensions = t.numberOfBlockedCustomExtensions + :amount WHERE t.id = :teamId")
  void increaseNumberOfBlockedCustomExtensions(@Param("teamId") UUID teamId, @Param("amount") int amount);
}
