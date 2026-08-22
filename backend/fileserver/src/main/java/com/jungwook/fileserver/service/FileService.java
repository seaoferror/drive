package com.jungwook.fileserver.service;

import com.jungwook.fileserver.domain.Team;
import com.jungwook.fileserver.domain.Member;
import com.jungwook.fileserver.domain.Metadata;
import com.jungwook.fileserver.dto.GetFileListResponse;
import com.jungwook.fileserver.dto.GetSignedURLResponse;
import com.jungwook.fileserver.projection.BlockedExtensionNameProjection;
import com.jungwook.fileserver.projection.MetadataIdNameProjection;
import com.jungwook.fileserver.repository.BlockedExtensionRepository;
import com.jungwook.fileserver.repository.MetadataRepository;
import com.jungwook.fileserver.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class FileService {

  @Value("${aws.bucket}")
  private String bucketName;

  private final MetadataRepository metadataRepository;
  private final BlockedExtensionRepository blockedExtensionRepository;
  private final MemberRepository memberRepository;
  private final Tika tika;
  private final S3Client s3Client;

  @Transactional
  public void uploadMultipartFile(UUID memberId, MultipartFile file) {
    //TODO: scan file with clamav first
    UUID teamId = memberRepository.findTeamIdByMemberId(memberId);
    //TODO: caching the blocked mimetypes and custom extensions in redis/valkey
    List<BlockedExtensionNameProjection> extensions = blockedExtensionRepository.findByTeamIdAndDeletedAtIsNull(teamId, BlockedExtensionNameProjection.class);
    List<String> blockedMimetypes = new ArrayList<>();
    List<String> blockedCustomExtensions = new ArrayList<>();
    for (var extension : extensions) {
      String mimetype = tika.detect("1." + extension.getName());
      if (mimetype.equals("application/octet-stream")) {
        blockedCustomExtensions.add(extension.getName());
        continue;
      }
      blockedMimetypes.add(mimetype);
    }
    String uploadedFileMimetype;
    String originalFilename = file.getOriginalFilename();
    if (originalFilename == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "파일 이름을 설정해주세요");
    }
    String uploadedFileExtension = StringUtils.getFilenameExtension(originalFilename);
    if (uploadedFileExtension == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "파일 확장자를 설정해주세요");
    }
    String lowerCasedUploadedFileExtension = uploadedFileExtension.toLowerCase();
    var metadata = Metadata.builder()
        .name(originalFilename)
        .createdBy(Member.builder().id(memberId).build())
        .team(Team.builder().id(teamId).build())
        .extension(lowerCasedUploadedFileExtension)
        .build();
    metadataRepository.save(metadata);
    try (var streamForTika = file.getInputStream()) {
      uploadedFileMimetype = tika.detect(streamForTika);
      if (blockedMimetypes.contains(uploadedFileMimetype) || blockedCustomExtensions.contains(lowerCasedUploadedFileExtension)) {
        throw new RuntimeException();
      }
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "업로드할 수 없는 파일입니다");
    }
    try (var streamForS3 = file.getInputStream()) {
      var putObjectRequest = PutObjectRequest.builder()
          .bucket(bucketName)
          .key("drive/"+ teamId.toString() + "/" + metadata.getId().toString() + "." + lowerCasedUploadedFileExtension)
          .build();
      log.info("metadata id: {}", metadata.getId());
      s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(streamForS3, file.getSize()));
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "업로드할 수 없는 파일입니다");
    }
  }

  public List<GetFileListResponse> getFileList(UUID memberId) {
    var teamId = memberRepository.findTeamIdByMemberId(memberId);
    var metadatas = metadataRepository
        .findByTeamIdAndDeletedAtIsNull(teamId, MetadataIdNameProjection.class);
    List<GetFileListResponse> responses = new ArrayList<>();
    for(var metadata: metadatas) {
      var response = GetFileListResponse.builder()
          .id(metadata.getId())
          .name(metadata.getName())
          .build();
      responses.add(response);
    }
    return responses;
  }

  public GetSignedURLResponse getSignedURL(UUID memberId, UUID fileId) {
    
    return null;
  }
}
