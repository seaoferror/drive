package com.jungwook.fileserver.service;

import com.jungwook.fileserver.domain.BlockedExtension;
import com.jungwook.fileserver.domain.Group;
import com.jungwook.fileserver.domain.Member;
import com.jungwook.fileserver.dto.GetBlockedExtensionsResponse;
import com.jungwook.fileserver.projection.BlockedExtensionIdNameProjection;
import com.jungwook.fileserver.repository.BlockedExtensionRepository;
import com.jungwook.fileserver.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ExtensionService {
  private final BlockedExtensionRepository blockedExtensionRepository;
  private final MemberRepository memberRepository;

  public List<GetBlockedExtensionsResponse> getBlockedExtensions(UUID memberId) {
    UUID groupId = memberRepository.findGroupIdByMemberId(memberId);
    List<BlockedExtensionIdNameProjection> extensions = blockedExtensionRepository.findByGroupIdAndDeletedAtIsNull(groupId, BlockedExtensionIdNameProjection.class);
    List<GetBlockedExtensionsResponse> responses = new ArrayList<>();
    for (var extension : extensions) {
      var response = GetBlockedExtensionsResponse.builder()
          .id(extension.getId())
          .name(extension.getName())
          .build();
      responses.add(response);
    }
    return responses;
  }

  @Transactional
  public void blockExtension(UUID memberId, String extensionName) {
    if (!extensionName.matches("^[a-zA-Z0-9]+$")) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "확장자는 영문자와 숫자만 입력 가능합니다.");
    }
    UUID groupId = memberRepository.findGroupIdByMemberId(memberId);
    String lowerCasedExtensionName = extensionName.toLowerCase();
    if (blockedExtensionRepository
        .existsByNameAndDeletedAtIsNullAndGroupId(lowerCasedExtensionName, groupId)) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 차단된 확장자입니다.");
    }

    BlockedExtension extension = BlockedExtension.builder()
        .name(lowerCasedExtensionName)
        .createdBy(Member.builder().id(memberId).build())
        .group(Group.builder().id(groupId).build())
        .build();
    blockedExtensionRepository.save(extension);
  }

  @Transactional
  public void unblockExtension(UUID memberId, UUID extensionId) {
    UUID extensionGroupId = blockedExtensionRepository.findGroupIdByExtensionId(extensionId).orElseThrow(
        () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "이 확장자는 존재하지 않습니다")
    );
    UUID memberGroupId = memberRepository.findGroupIdByMemberId(memberId);
    if (!extensionGroupId.equals(memberGroupId)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST,
          "이 확장자는 삭제할 권한이 없습니다"
      );
    }
    blockedExtensionRepository.softDeleteById(
        extensionId,
        Instant.now(),
        Member.builder().id(memberId).build());
  }
}
