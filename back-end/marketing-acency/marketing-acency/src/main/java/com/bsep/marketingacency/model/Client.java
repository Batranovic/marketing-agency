package com.bsep.marketingacency.model;

import com.bsep.marketingacency.enumerations.ClientType;
import com.bsep.marketingacency.enumerations.RegistrationRequestStatus;
import com.bsep.marketingacency.service.AESConverter;
import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.SecretKey;
import java.beans.ConstructorProperties;

@Getter
@Setter
@Entity
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private ClientType type;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "pib")
    private Integer pib;

    @ManyToOne
    @JoinColumn(name = "package_id")
    private Package clientPackage;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "address")
    private String address;

    @Column(name = "city")
    private String city;

    @Column(name = "country")
    private String country;

    @Column(name = "is_approved")
    private RegistrationRequestStatus isApproved;


    public Client() {
    }

    public Client(Long id, User user, ClientType type, String firstName, String lastName, String companyName, Integer pib, Package clientPackage, String phoneNumber, String address, String city, String country, RegistrationRequestStatus isApproved) {
        Id = id;
        this.user = user;
        this.type = type;
        this.firstName = firstName;
        this.lastName = lastName;
        this.companyName = companyName;
        this.pib = pib;
        this.clientPackage = clientPackage;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.city = city;
        this.country = country;
        this.isApproved = isApproved;
    }

    public Long getId() {
        return Id;
    }

    public User getUser() {
        return user;
    }

    public ClientType getType() {
        return type;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getCompanyName() {
        return companyName;
    }

    public Integer getPib() {
        return pib;
    }

    public Package getClientPackage() {
        return clientPackage;
    }

    public String getPhoneNumber(SecretKey key) throws IllegalBlockSizeException, BadPaddingException {
        return AESConverter.decryptFromString(key, this.phoneNumber);
    }

    public String getAddress(SecretKey key) throws IllegalBlockSizeException, BadPaddingException {
        return AESConverter.decryptFromString(key, this.address);
    }

    public Integer getPib(SecretKey key) throws IllegalBlockSizeException, BadPaddingException {
        return AESConverter.decryptFromInteger(key, this.pib);
    }

    public String getCity() {
        return city;
    }

    public String getCountry() {
        return country;
    }

    public RegistrationRequestStatus getIsApproved() {
        return isApproved;
    }

    public void setId(Long id) {
        Id = id;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setType(ClientType type) {
        this.type = type;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public void setClientPackage(Package clientPackage) {
        this.clientPackage = clientPackage;
    }

    public void setPhoneNumber(String phoneNumber, SecretKey key) {
        this.phoneNumber = AESConverter.encryptToString(key, phoneNumber);
    }

    public void setAddress(String address, SecretKey key) {
        this.address = AESConverter.encryptToString(key, address);
    }

    public void setPib(Integer pib, SecretKey key) {
        this.pib = AESConverter.encryptToInteger(key, pib);
    }


    public void setCity(String city) {
        this.city = city;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public void setIsApproved(RegistrationRequestStatus isApproved) {
        this.isApproved = isApproved;
    }

    public String getFirstName(SecretKey key) throws IllegalBlockSizeException, BadPaddingException {
        return AESConverter.decryptFromString(key, this.firstName);
    }

    public String getLastName(SecretKey key) throws IllegalBlockSizeException, BadPaddingException {
        return AESConverter.decryptFromString(key, this.lastName);
    }

    public void setFirstName(String firstName, SecretKey key) {
        this.firstName = AESConverter.encryptToString(key, firstName);
    }

    public void setLastName(String lastName, SecretKey key) {
        this.lastName = AESConverter.encryptToString(key, lastName);
    }
}
