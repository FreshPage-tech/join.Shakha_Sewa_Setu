-- Add S3 storage columns to announcements table
ALTER TABLE "public"."announcements"
ADD COLUMN "banner_url" "text",
ADD COLUMN "banner_s3_key" "text",
ADD COLUMN "file_url" "text",
ADD COLUMN "file_s3_key" "text";
-- Add comment documenting the S3 key storage pattern
COMMENT ON COLUMN "public"."announcements"."banner_s3_key" IS 'Relative S3 key path for banner image (format: announcements/banners/{id}/{filename})';
COMMENT ON COLUMN "public"."announcements"."file_s3_key" IS 'Relative S3 key path for attachment file (format: announcements/files/{id}/{filename})';
