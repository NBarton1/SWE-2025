//package com.jknv.lum.controller
//
//import com.jknv.lum.model.dto.AccountDTO
//import com.jknv.lum.model.entity.Account
//import com.jknv.lum.model.request.account.AccountCreateRequest
//import com.jknv.lum.model.request.account.AccountLoginRequest
//import com.jknv.lum.model.request.account.AccountUpdateRequest
//import com.jknv.lum.model.type.Role
//import com.jknv.lum.security.AccountDetails
//import com.jknv.lum.services.AccountService
//import com.jknv.lum.services.ContentService
//import com.jknv.lum.services.CookieService
//import io.mockk.every
//import io.mockk.justRun
//import io.mockk.mockk
//import io.mockk.verify
//import jakarta.servlet.http.HttpServletResponse
//import org.junit.jupiter.api.Assertions.assertEquals
//import org.junit.jupiter.api.BeforeEach
//import org.junit.jupiter.api.Test
//import org.springframework.boot.test.context.SpringBootTest
//import org.springframework.http.HttpHeaders
//import org.springframework.http.HttpStatus
//import org.springframework.http.ResponseCookie
//import org.springframework.http.ResponseEntity
//import org.springframework.transaction.annotation.Transactional
//import kotlin.test.assertNull
//
//
//@SpringBootTest
//@Transactional
//class AccountControllerTest {
//    var accountService: AccountService = mockk()
//    var cookieService: CookieService = mockk()
//    var contentService: ContentService = mockk()
//
//    var accountController: AccountController = AccountController(accountService, cookieService, contentService)
//
//    lateinit var req: AccountCreateRequest
//    lateinit var account: Account
//    lateinit var accountDTO: AccountDTO
//
//    @BeforeEach
//    fun setup() {
//        req = AccountCreateRequest(
//            name = "name",
//            username = "username",
//            password = "password",
//            role = Role.ADMIN,
//        )
//        account = req.toEntity()
//        accountDTO = account.toDTO()
//    }
//
//    @Test
//    fun createAccountTest() {
//        every { accountService.createAccountWithRoles(req) } returns accountDTO
//
//        val result: ResponseEntity<AccountDTO> = accountController.create(req)
//
//        verify(exactly = 1) { accountService.createAccountWithRoles(req) }
//        assertEquals(HttpStatus.CREATED, result.statusCode)
//        assertEquals(accountDTO, result.body)
//    }
//
//    @Test
//    fun getAccountsTest() {
//        every { accountService.getAccounts() } returns listOf(accountDTO)
//
//        val response: ResponseEntity<List<AccountDTO>> = accountController.getAll()
//
//        verify(exactly = 1) { accountService.getAccounts() }
//        assertEquals(HttpStatus.OK, response.statusCode)
//        assertEquals(listOf(accountDTO), response.body)
//    }
//
//    @Test
//    fun updateAccountTest() {
//        val update = AccountUpdateRequest(
//            name = "newname",
//            username = "newusername",
//            password = "newpassword",
//        )
//        val expectedDTO = AccountDTO(
//            id = account.id,
//            name = "newname",
//            username = "newusername",
//            role = account.role,
//        )
//
//        val details = AccountDetails(account)
//
//        every { accountService.updateAccount(account.id, update) } returns expectedDTO
//
//        val response: ResponseEntity<AccountDTO> = accountController.update(update, details)
//
//        verify(exactly = 1) { accountService.updateAccount(account.id, update) }
//        assertEquals(HttpStatus.ACCEPTED, response.statusCode)
//        assertEquals(expectedDTO, response.body)
//    }
//
//    @Test
//    fun deleteAccountTest() {
//        justRun { accountService.deleteAccount(account.id) }
//
//        val response: ResponseEntity<Void> = accountController.delete(account.id)
//
//        verify(exactly = 1) { accountService.deleteAccount(account.id) }
//        assertEquals(HttpStatus.OK, response.statusCode)
//        assertNull(response.body)
//    }
//
//    @Test
//    fun loginTest() {
//        val loginReq = AccountLoginRequest(username = "user1", password = "pass")
//        val response = mockk<HttpServletResponse>(relaxed = true)
//        val token = "jwt-token"
//        val cookie = ResponseCookie.from("token", token).build()
//
//        every { accountService.verifyLogin(loginReq) } returns token
//        every { accountService.getAccountByUsername("user1") } returns account
//        every { cookieService.giveLoginCookie(token) } returns cookie
//
//        val result: ResponseEntity<Long> = accountController.login(loginReq, response)
//
//        verify { accountService.verifyLogin(loginReq) }
//        verify { cookieService.giveLoginCookie(token) }
//        verify { response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString()) }
//
//        assertEquals(HttpStatus.OK, result.statusCode)
//        assertEquals(account.id, result.body)
//    }
//}
