package com.jungwook.fileserver.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.Instant;
import java.util.UUID;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FileMetadata {
  @Id
  @UuidGenerator(style = UuidGenerator.Style.VERSION_7)
  private UUID id;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false)
  private String createdBy;

  private Instant deletedAt;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(
      name = "deleted_by_member_id",
      foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT)
  )
  private Member deletedBy;

  @NotNull
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(
      name = "group_id",
      foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT),
      nullable = false
  )
  private Group group;
}
