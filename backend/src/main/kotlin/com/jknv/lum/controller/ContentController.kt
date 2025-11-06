    package com.jknv.lum.controller

    import com.jknv.lum.model.dto.ContentDTO
    import com.jknv.lum.services.ContentService
    import org.springframework.http.MediaType
    import org.springframework.http.ResponseEntity
    import org.springframework.web.bind.annotation.*
    import org.springframework.web.multipart.MultipartFile

    @RestController
    @RequestMapping("/api/content")
    class ContentController(
        private val contentService: ContentService,
    ) {

        // Might need use in the future (generic file upload)
//        @PostMapping("/upload")
//        fun upload(@RequestParam("file") file: MultipartFile): ResponseEntity<ContentDTO> {
//            val metadata = contentService.upload(file)
//            return ResponseEntity.ok(metadata)
//        }

        @GetMapping("/{fileId}")
        fun download(@PathVariable fileId: Long): ResponseEntity<ByteArray> {
            val contentDTO = contentService.getContent(fileId)
            val contentBytes = contentService.download(contentDTO)
            val contentType = MediaType.parseMediaType(contentDTO.contentType)
            return ResponseEntity.ok()
                .contentType(contentType)
                .body(contentBytes)
        }

    }