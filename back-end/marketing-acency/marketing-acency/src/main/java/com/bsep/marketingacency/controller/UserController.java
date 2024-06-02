package com.bsep.marketingacency.controller;

import com.bsep.marketingacency.dto.EmployeeDto;
import com.bsep.marketingacency.dto.UserDto;
import com.bsep.marketingacency.model.*;
import com.bsep.marketingacency.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "https://localhost:4200")
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private LoginTokenService loginTokenService;

    @Autowired
    private ClientActivationTokenService clientActivationTokenService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private RejectionNoteService rejectionNoteService;

    @Autowired
    private ClientService clientService;

    @PutMapping(value = "/activation/{id}")
    public ResponseEntity<String> updateIsActivated(@PathVariable Long id){
        userService.updateIsActivated(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(value = "/{mail}")
    public ResponseEntity<User> findUserByMail(@PathVariable String mail){
        User user = userService.findByMail(mail);
        if(user == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(user);
    }

    @GetMapping(value = "/package/{mail}")
    public ResponseEntity<Boolean> checkIfUserHasAppropriatePackage(@PathVariable String mail){
        User user = userService.findByMail(mail);
        if(user == null && !clientService.checkIfClientCanLoginWithoutPassword(mail)){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(true);
    }
    @GetMapping(value = "/findByEmail/{mail}")
    public ResponseEntity<User> findByMail(@PathVariable String mail) {
        User user = userService.findByMail(mail);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping(value = "/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        User user = userService.findUserById(userId);
        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        clientService.deleteClient(userId);
        loginTokenService.delete(userId);
        clientActivationTokenService.delete(userId);
        refreshTokenService.deleteByUserId(userId);
        rejectionNoteService.delete(userId);
        userService.deleteUser(userId);

        return new ResponseEntity<>("User data deleted successfully", HttpStatus.OK);
    }

}
