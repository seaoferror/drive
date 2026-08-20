package com.jungwook.fileserver.repository;

import com.jungwook.fileserver.domain.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface GroupRepository  extends JpaRepository<Group, UUID> {

  @Query("SELECT g.numberOfBlockedCustomExtensions FROM Group g WHERE g.id = :groupId")
  Integer findNumberOfBlockedCustomExtensionsById(@Param("groupId") UUID groupId);

  @Modifying(clearAutomatically = true)
  @Query("UPDATE Group g SET g.numberOfBlockedCustomExtensions = g.numberOfBlockedCustomExtensions + :amount WHERE g.id = :groupId")
  void increaseNumberOfBlockedCustomExtensions(@Param("groupId") UUID groupId, @Param("amount") int amount);
}
