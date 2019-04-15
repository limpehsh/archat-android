export default class Utils {

  static validateEmail(email) {
    const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    if(email.length <= 0) {
        return {
            valid: false,
            message: 'Please enter an email address.'
          };
      }
      if(!regex.test(email)) {
        return {
            valid: false,
            message: 'Please enter a valid email address.'
          };
      }

      return { valid: true, message: 'Nice job, champ!' };
  }

  static validatePassword(password) {

    if(password.length < 8) {
      return {
        valid: false,
        message: 'Password must be at least 8 characters long.'
      };
    }

    return { valid: true, message: 'Nice job, champ!' };
  }

  static validateUsername(username) {
    const regex = /^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/;

    if(username.length <= 0) {
        return {
            valid: false,
            message: 'Please enter a username. '
        };
    }
    if(username.length > 20) {
      return {
          valid: false,
          message: 'Usernames cannot be more than 20 characters long.'
        };
    }
    if(!regex.test(username)) {
      return {
          valid: false,
          message: 'Usernames can only contain alphanumeric characters or'
                    + ' non-adjacent hyphens, and cannot begin with a hyphen.'
      }
    }

    return { valid: true, message: 'Nice job, champ!'}
  }

  static calculate_distance(location1, location2) {
    var latDist = location1.latitude-location2.latitude;
    var longDist = location1.longitude-location2.longitude;
    var dist = Math.sqrt(Math.pow(latDist,2)*111+Math.pow(longdist,2)*111);
    return dist.toFixed(2).toString();
  }

/*  static getUserLocation(usid, meetD) {
    for (user in meetD) {
      if (user._id == usid) {
        return (user.location);
      }
    }
  }*/

}
