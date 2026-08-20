package com.jungwook.fileserver.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Member {
  @Id
  @UuidGenerator(style = UuidGenerator.Style.VERSION_7)
  private UUID id;

  @Column(columnDefinition = "TEXT", nullable = false)
  private String name;

  @Column(columnDefinition = "TEXT", nullable = false)
  private String email;

  @Column(columnDefinition = "TEXT", nullable = false)
  private String password;

  @Column(columnDefinition = "TEXT", nullable = false)
  private String role;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(
      name = "group_id",
      nullable = false
  )
  private Group group;
}
