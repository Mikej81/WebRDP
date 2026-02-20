import createDebug from 'debug';
import Auth from 'basic-auth';

const debug = createDebug('WebRDP');

export function basicAuth(req, res, next) {
  const myAuth = Auth(req);
  if (myAuth) {
    const userstr = myAuth.name.toString();
    if (userstr.indexOf('\\') > -1) {
      const parts = myAuth.name.split('\\');
      req.session.rdpdomain = parts[0].replace('\\', '');
      req.session.username = parts[1].replace('\\', '');
    } else {
      req.session.rdpdomain = '';
      req.session.username = myAuth.name;
    }
    req.session.userpassword = myAuth.pass;
    debug(`myAuth.name: ${myAuth.name} and password ${myAuth.pass ? 'exists' : 'is blank'}`);
    next();
  } else {
    res.statusCode = 401;
    debug('basicAuth credential request (401)');
    res.setHeader('WWW-Authenticate', 'Basic realm="WebRDP"');
    res.end('Username and password required for web RDP service.');
  }
}
