
import utils from '/k1/libK1_Utils.js'
import sess from '/k1/libK1_Sesion.js'
import {vgApp,goPag} from '/js/seeds_VGlob.js'


function sesionOK(){
	console.log('sesion OK:', utils.o2s(utils.vgk.user));
	utils.r$('usuario').innerHTML = utils.vgk.user.usr;
}
function loginOK(){
	console.log('usr/pwd OK:', utils.o2s(utils.vgk.user));
	console.log('sesion_id:', utils.vgk.sesion_id);
	if (utils.vgk.user.rol == 'ADMIN'){
			utils.vgk.fnUserOK = sesionOK;
			sess.getSesion(utils.vgk.sesion_id);
		}
}

function initLogin(){
	var usr = document.getElementById("usr").value;
	var pwd = document.getElementById("pwd").value;
	console.log('login',usr,pwd);				
	sess.validaUser(usr,pwd,loginOK);
}

window.initLogin = initLogin;
window.vgApp = vgApp;