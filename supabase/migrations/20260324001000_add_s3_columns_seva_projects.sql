-- Add S3 storage columns to seva_projects table
ALTER TABLE "public"."seva_projects"
ADD COLUMN "hero_image_url" "text",
ADD COLUMN "hero_image_s3_key" "text",
ADD COLUMN "thumbnail_url" "text",
ADD COLUMN "thumbnail_s3_key" "text";
-- Add comment documenting the S3 key storage pattern
COMMENT ON COLUMN "public"."seva_projects"."hero_image_s3_key" IS 'Relative S3 key path for hero/banner image (format: seva/banners/{id}/{filename})';
COMMENT ON COLUMN "public"."seva_projects"."thumbnail_s3_key" IS 'Relative S3 key path for thumbnail image (format: seva/thumbnails/{id}/{filename})';
