import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/feature-modules/user/user.service';
import { AuthService } from '../auth.service';
import { User } from '../model/user.model';
import { ClientType } from 'src/app/feature-modules/user/model/clientType.model';
import { RegistrationRequestStatus } from 'src/app/feature-modules/user/model/registrationRequestStatus.model';
import { Package } from 'src/app/feature-modules/user/model/package.model';
import { Client } from 'src/app/feature-modules/user/model/client.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit{
  @ViewChild('pwnedPasswordInput') pwnedPasswordInput!: ElementRef;
  formUser!: FormGroup;
  formIndividual!: FormGroup;
  formLegalEntity!: FormGroup;
  submitted = false;
  registrationError = '';
  shouldRenderIndividual:boolean = false;
  shouldRenderLegalEntity:boolean = false;
  shouldRenderThirdStepIndividual:boolean = false;
  shouldRenderThirdStepLegalEntity:boolean = false;
  shouldRenderLastStepIndividual:boolean = false;
  shouldRenderLastStepLegalEntity:boolean = false;
  //user!: User;
  firstname?: string | null;
  lastname?: string | null;
  companyName?: string | null;
  pib?: number | null;
  phoneNumber!: string;
  clientPackage!: Package;
  address!: string;
  city!: string;
  country!: string;
  isApproved!: RegistrationRequestStatus;
  userId!: number | undefined;
  selectedPackage: string = '';
  password: string = '';
  pwnedPasswordValue!: string;
  passwordValue!: string;
  user: User = {
    mail: '',
    password: '',
    confirmationPassword: '',
    roles: [],
    isBlocked: false,
    isActivated: false,
    mfa: false,
  };


  constructor(private formBuilder: FormBuilder, 
              private authService: AuthService, 
              private router: Router, 
              private userService: UserService){
  }

  ngOnInit(): void {
    this.formUser = this.formBuilder.group({
      mail: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(64)])],
      //password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+.=])(?=\\S+$).{8,}$')])],
      confirmationPassword: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+.=])(?=\\S+$).{8,}$')])],
      enableTwoFactorAuth: [false]
    });


    this.formIndividual = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      phoneNumber: ['', Validators.required]
    });

    this.formLegalEntity = this.formBuilder.group({
      companyName: ['', Validators.required],
      pib: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      phoneNumber: ['', Validators.required]
    });

    

   /* document.addEventListener('pwnedPasswordFound', (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail === 0) {
        const passwordInput = this.pwnedPasswordInput.nativeElement;
        this.pwnedPasswordValue = passwordInput.value;
        console.log('Password hasn\'t been pwned - submit your form');
        // Sada možete koristiti vrednost pwnedPasswordValue po potrebi
      } else {
        alert(`Password has been pwned ${customEvent.detail} times!`);
      }
    });*/
    
  }






  registerIndividual()  {  
    this.shouldRenderIndividual = true;
    
  }

  registerLegalEntity()  {  
    this.shouldRenderLegalEntity = true;   
  }

  thirdStepIndividual()  {  
    var pwnedPasswordElement = document.getElementById('pwnedPasswordInput');

    // Provera da li je element pronađen
    if (pwnedPasswordElement !== null) {
        // Pronalaženje input elementa unutar pwnedPasswordElementa
        var inputElement = pwnedPasswordElement.querySelector('input');

        // Provera da li je pronađen input element
        if (inputElement !== null) {
            // Dobijanje vrednosti iz input elementa
            this.passwordValue = inputElement.value;

            // Korišćenje dobijene vrednosti
            console.log(this.passwordValue);
        } else {
            console.log("Input element unutar 'pwnedPasswordInput' nije pronađen.");
        }
    } else {
        console.log("Element 'pwnedPasswordInput' nije pronađen.");
    }

    
    
      // Koristi ovu vrednost po potrebi
      const email = this.formUser.get('mail')?.value;
      this.user.mail = email;
      this.user.confirmationPassword = this.formUser.get('confirmationPassword')?.value;
      this.user.password = this.passwordValue
      this.user.mfa = this.formUser.get('enableTwoFactorAuth')?.value;

      this.authService.saveUser(
        this.user
        //this.user = this.formUser.value
      )
      .subscribe(
        (response) => {
          console.log('User saved!');
        },
        (error) => {
          // Handle reservation error
          if (error.status === 400) {
            alert('Password must be at least 8 characters long and contain at least one digit, one lowercase letter, one uppercase letter, one special character, and no whitespace.'); 
          } else if (error.status === 409) {
            alert('Password and confirmation password do not match.');
          }
          else if (error.status === 403) {
            alert('User has already been rejected. Please try again later.');
          }
          else if (error.status === 422) {
            alert('Invalid email format or email is already in use.'); 
          }
          if (error.status === 201) {
            console.log('User saved!');
            if (this.shouldRenderIndividual)
            {
              this.shouldRenderThirdStepIndividual = true;
              this.shouldRenderIndividual = false;
            }
            else{
              this.shouldRenderLegalEntity = false;
              this.shouldRenderThirdStepLegalEntity = true;
            }
            
          }
          
        }
      );

  
  }

  

  lastStepIndividual()  {  
    if (this.formIndividual.valid) {
      this.firstname = this.formIndividual.value.firstname;
      this.lastname = this.formIndividual.value.lastname;
      this.address = this.formIndividual.value.address;
      this.city = this.formIndividual.value.city;
      this.country = this.formIndividual.value.country;
      this.phoneNumber = this.formIndividual.value.phoneNumber;

      this.shouldRenderThirdStepIndividual = false;
      this.shouldRenderLastStepIndividual = true;
    } else{
      alert('Form is invalid. Please fill in all required fields.');
    }
       
  }

  lastStepLegalEntity()  {  
    if (this.formLegalEntity.valid) {
      this.companyName = this.formLegalEntity.value.companyName;
      this.pib = this.formLegalEntity.value.pib;
      this.address = this.formLegalEntity.value.address;
      this.city = this.formLegalEntity.value.city;
      this.country = this.formLegalEntity.value.country;
      this.phoneNumber = this.formLegalEntity.value.phoneNumber;

      this.shouldRenderThirdStepLegalEntity = false;
      this.shouldRenderLastStepLegalEntity = true;
    } else{
      alert('Form is invalid. Please fill in all required fields.');
    }
       
  }


  addBasicPackage()  { 
    this.selectedPackage = 'basic';  
    this.userService.getPackageByName('BASIC').subscribe(
      (packagee: Package) => {
        this.clientPackage = packagee;
        console.log('Basic Package:', this.clientPackage);
      },
      (error) => {
        console.error('Error fetching Basic Package:', error);
      }
    );
  }

  addStandardPackage()  {
    this.selectedPackage = 'standard';  
    this.userService.getPackageByName('STANDARD').subscribe(
      (packagee: Package) => {
        this.clientPackage = packagee;
        console.log('Basic Package:', this.clientPackage);
      },
      (error) => {
        console.error('Error fetching Standard Package:', error);
      }
    ); 
  }

  addGoldPackage()  { 
    this.selectedPackage = 'gold';
    this.userService.getPackageByName('GOLD').subscribe(
      (packagee: Package) => {
        this.clientPackage = packagee;
        console.log('Gold Package:', this.clientPackage);
      },
      (error) => {
        console.error('Error fetching Gold Package:', error);
      }
    );  
  }

  submitIndividual() {
    this.userService.findUserIdByEmail(this.user.mail).subscribe(
      (user) => {
        this.userId = user.id;
  
        const client: Client = {
          user: user.mail,
          type: ClientType.INDIVIDUAL, 
          firstName: this.firstname,
          lastName: this.lastname,
          companyName: null,
          pib: null,
          clientPackage: this.clientPackage.name, 
          phoneNumber: this.phoneNumber,
          address: this.address,
          city: this.city,
          country: this.country,
          isApproved: RegistrationRequestStatus.PENDING 
        };
      
        // Sada možete poslati ovaj objekt na vaš endpoint za registraciju klijenta
        this.authService.registerClient(client).subscribe(
          (response) => {
            console.log('Klijent uspešno registrovan!');
            alert("Successfully sent a registration request!");
            //this.router.navigate(['/']);
            if (response.mfa) {
              //setQrImageUrl(response.secretImageUri);
              this.router.navigate(['/qrcode'], { queryParams: { secretImageUri: response.secretImageUri } });
           } else {
            this.router.navigate(['/']);
           }
          },
          (error) => {
            console.error('Greška prilikom registracije klijenta:', error);
            // Dodajte logiku za upravljanje greškama prilikom registracije
          }
        );
      },
      (error) => {
        console.error('Error finding user ID:', error);
        // Ovde možete dodati logiku za upravljanje greškama
      }
    );
  }


    submitLegalEntity() {
      this.userService.findUserIdByEmail(this.user.mail).subscribe(
        (user) => {
          this.userId = user.id;
    
          const client: Client = {
            user: user.mail,
            type: ClientType.LEGAL_ENTITY, 
            firstName: null,
            lastName: null,
            companyName: this.companyName,
            pib: this.pib,
            clientPackage: this.clientPackage.name, 
            phoneNumber: this.phoneNumber,
            address: this.address,
            city: this.city,
            country: this.country,
            isApproved: RegistrationRequestStatus.PENDING 
          };
        
          // Sada možete poslati ovaj objekt na vaš endpoint za registraciju klijenta
          this.authService.registerClient(client).subscribe(
            (response) => {
              console.log('Klijent uspešno registrovan!');
              alert("Successfully sent a registration request!");
            },
            (error) => {
              console.error('Greška prilikom registracije klijenta:', error);
              // Dodajte logiku za upravljanje greškama prilikom registracije
            }
          );
        },
        (error) => {
          console.error('Error finding user ID:', error);
          // Ovde možete dodati logiku za upravljanje greškama
        }
      );
    }
  
  
  

}

document.addEventListener('pwnedPasswordFound', (e: Event) => {
  const customEvent = e as CustomEvent;
  if (customEvent.detail === 0) {
    const passwordInput = (e.target as HTMLElement).querySelector('input') as HTMLInputElement | null;
    if (passwordInput) {
      const password = passwordInput.value;
      console.log('Password hasn\'t been pwned - submit your form');
    }
  } else {
    alert(`Password has been pwned ${customEvent.detail} times!`);
  }
});








