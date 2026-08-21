package com.jungwook.fileserver.service;

import com.jungwook.fileserver.domain.BlockedExtension;
import com.jungwook.fileserver.domain.Team;
import com.jungwook.fileserver.domain.Member;
import com.jungwook.fileserver.dto.GetBlockedExtensionsResponse;
import com.jungwook.fileserver.projection.BlockedExtensionIdNameProjection;
import com.jungwook.fileserver.repository.BlockedExtensionRepository;
import com.jungwook.fileserver.repository.TeamRepository;
import com.jungwook.fileserver.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
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
  private final TeamRepository teamRepository;

  private static final List<String> FIXED_EXTENSIONS = new ArrayList<>(List.of("bat", "cmd", "com", "cpl", "exe", "scr", "js"));

  public List<GetBlockedExtensionsResponse> getBlockedExtensions(UUID memberId) {
    UUID teamId = memberRepository.findTeamIdByMemberId(memberId);
    List<BlockedExtensionIdNameProjection> extensions = blockedExtensionRepository.findByTeamIdAndDeletedAtIsNull(teamId, BlockedExtensionIdNameProjection.class);
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
    UUID teamId = memberRepository.findTeamIdByMemberId(memberId);
    String lowerCasedExtensionName = extensionName.toLowerCase();
    if (blockedExtensionRepository
        .existsByNameAndDeletedAtIsNullAndTeamId(lowerCasedExtensionName, teamId)) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 차단된 확장자입니다.");
    }
    if(!FIXED_EXTENSIONS.contains(lowerCasedExtensionName)){
      Integer current = teamRepository.findNumberOfBlockedCustomExtensionsById(teamId);
      if(current >= 200) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "커스텀 확장자는 200개까지만 추가할 수 있습니다.");
      }
      teamRepository.increaseNumberOfBlockedCustomExtensions(teamId, 1);
    }

    BlockedExtension extension = BlockedExtension.builder()
        .name(lowerCasedExtensionName)
        .createdBy(Member.builder().id(memberId).build())
        .team(Team.builder().id(teamId).build())
        .build();
    blockedExtensionRepository.save(extension);
  }

  @Transactional
  public void unblockExtension(UUID memberId, UUID extensionId) {
    UUID extensionTeamId = blockedExtensionRepository.findTeamIdByExtensionId(extensionId).orElseThrow(
        () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "이 확장자는 존재하지 않습니다")
    );
    UUID memberTeamId = memberRepository.findTeamIdByMemberId(memberId);
    if (!extensionTeamId.equals(memberTeamId)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST,
          "이 확장자는 삭제할 권한이 없습니다"
      );
    }
    String name = blockedExtensionRepository.findNameByExtensionId(extensionId);
    if(!FIXED_EXTENSIONS.contains(name)) {
      teamRepository.increaseNumberOfBlockedCustomExtensions(extensionTeamId, -1);
    }
    blockedExtensionRepository.softDeleteById(
        extensionId,
        Instant.now(),
        Member.builder().id(memberId).build());
  }
}
