package com.jungwook.fileserver.repository;

import com.jungwook.fileserver.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MemberRepository extends JpaRepository<Member, UUID> {
  @Query("SELECT m.group.id FROM Member m WHERE m.id = :memberId")
  UUID findGroupIdByMemberId(@Param("memberId") UUID memberId);
}
