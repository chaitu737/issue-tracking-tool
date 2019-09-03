import { TestBed } from '@angular/core/testing';

import { Userservice} from './user.service';

describe('AuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Userservice = TestBed.get(Userservice);
    expect(service).toBeTruthy();
  });
});
