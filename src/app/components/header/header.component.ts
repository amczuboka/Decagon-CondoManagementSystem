import { AfterViewChecked, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements AfterViewChecked {
  authority!: string;
  myUser!: any;
  // TODO: Retrieve notifications from the user's account
  notifications: string[] = ['Here is your registration key', 'test'];

  constructor(
    public authService: AuthService,
    private Acrouter: ActivatedRoute
  ) {}

  ngAfterViewChecked() {
    this.myUser = this.authService.getUser();
    const type = this.Acrouter.snapshot.params['type'];
    if (type) {
      this.authority = type;
    }
    if (this.myUser) {
      this.authority = this.myUser.Authority;
    }
  }
}
