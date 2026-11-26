-- Comprehensive S3 Media Migration
-- Adds S3 key columns to all content tables while preserving legacy url columns

-- ============================================================================
-- PROFILES: Avatar support
-- ============================================================================
ALTER TABLE "public"."profiles"
  ADD COLUMN IF NOT EXISTS "avatar_key" "text",
  ADD COLUMN IF NOT EXISTS "avatar_url" "text";
COMMENT ON COLUMN "public"."profiles"."avatar_key" IS '[S3] Relative S3 key for user avatar (format: profiles/avatars/{user_id}/{filename})';
COMMENT ON COLUMN "public"."profiles"."avatar_url" IS '[LEGACY - S3 backed] CloudFront URL for avatar, built from avatar_key';
-- ============================================================================
-- EVENTS: Banner and gallery support
-- ============================================================================
ALTER TABLE "public"."events"
  ADD COLUMN IF NOT EXISTS "banner_key" "text",
  ADD COLUMN IF NOT EXISTS "gallery_keys" "text"[] DEFAULT '{}';
COMMENT ON COLUMN "public"."events"."banner_key" IS '[S3] Relative S3 key for event banner (format: events/banners/{event_id}/{filename})';
COMMENT ON COLUMN "public"."events"."gallery_keys" IS '[S3] Array of S3 keys for event photo gallery (format: events/gallery/{event_id}/{filename})';
COMMENT ON COLUMN "public"."events"."image_url" IS '[LEGACY] Original image URL - kept for backward compatibility';
-- ============================================================================
-- SEVA_PROJECTS: Hero image and PDF documents
-- ============================================================================
ALTER TABLE "public"."seva_projects"
  ADD COLUMN IF NOT EXISTS "hero_image_key" "text",
  ADD COLUMN IF NOT EXISTS "document_key" "text";
COMMENT ON COLUMN "public"."seva_projects"."hero_image_key" IS '[S3] Relative S3 key for project hero/banner image (format: seva/images/{project_id}/{filename})';
COMMENT ON COLUMN "public"."seva_projects"."document_key" IS '[S3] Relative S3 key for project PDF or document (format: seva/documents/{project_id}/{filename})';
-- ============================================================================
-- BAUDDHIK_CONTENT: Audio/PDF and thumbnail support
-- ============================================================================
ALTER TABLE "public"."bauddhik_content"
  ADD COLUMN IF NOT EXISTS "s3_key" "text",
  ADD COLUMN IF NOT EXISTS "thumbnail_key" "text";
COMMENT ON COLUMN "public"."bauddhik_content"."s3_key" IS '[S3] Relative S3 key for content file (audio MP3/WAV, PDF, etc) (format: bauddhik/{category}/{content_id}/{filename})';
COMMENT ON COLUMN "public"."bauddhik_content"."thumbnail_key" IS '[S3] Relative S3 key for content thumbnail image (format: bauddhik/thumbnails/{content_id}/{filename})';
COMMENT ON COLUMN "public"."bauddhik_content"."url" IS '[LEGACY - S3 backed] CloudFront URL for content file, built from s3_key or thumbnail_key';
COMMENT ON COLUMN "public"."bauddhik_content"."thumbnail" IS '[LEGACY - S3 backed] CloudFront URL for thumbnail, built from thumbnail_key';
-- ============================================================================
-- ANNOUNCEMENTS: Attachment support
-- ============================================================================
ALTER TABLE "public"."announcements"
  ADD COLUMN IF NOT EXISTS "attachment_key" "text";
COMMENT ON COLUMN "public"."announcements"."attachment_key" IS '[S3] Relative S3 key for attachment file (PDF, image, etc) (format: announcements/attachments/{announcement_id}/{filename})';
-- Mark existing columns as legacy where appropriate
COMMENT ON COLUMN "public"."announcements"."title" IS 'Announcement title';
-- ============================================================================
-- S3 KEY FORMAT REFERENCE
-- ============================================================================
-- All S3 keys follow this pattern for consistency:
--
-- profiles/avatars/{user_id}/{timestamp}-{random}.{ext}
-- events/banners/{event_id}/{timestamp}-{random}.{ext}
-- events/gallery/{event_id}/{filename} (array of multiple)
-- seva/images/{project_id}/{timestamp}-{random}.{ext}
-- seva/documents/{project_id}/{timestamp}-{random}.pdf
-- bauddhik/{category}/{content_id}/{timestamp}-{random}.{ext}
-- bauddhik/thumbnails/{content_id}/{timestamp}-{random}.jpg
-- announcements/attachments/{announcement_id}/{timestamp}-{random}.{ext}
--
-- CloudFront URL construction:
-- {AWS_CLOUDFRONT_DOMAIN}/{s3_key}
-- Example: https://cdn.example.com/profiles/avatars/uuid/123456-abc789.jpg

-- ============================================================================
-- MIGRATION NOTES
-- ============================================================================
-- • All new columns added as TEXT type (flexible for future extensions)
-- • gallery_keys is a TEXT[] array for multiple files
-- • Existing url/image_url columns preserved for backward compatibility
-- • Migration is idempotent (uses IF NOT EXISTS)
-- • No data migration needed - existing content continues to work
-- • New uploads will populate S3 key columns via updated API endpoints
-- • CloudFront URL construction happens at application layer;
