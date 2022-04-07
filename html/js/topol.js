
import utils from '/k1/libK1_Utils.js'
import sess  from '/k1/libK1_Sesion.js'
import ajax  from '/k1/libK1_Ajax.js'
import topol from '/k1/libK1_Topol.js'

import {vgApp,goPag} from '/js/seeds_VGlob.js'


function nuevaTopol(tipo){
	switch (tipo){
		case 'CONJT' :
			var tag = prompt('Tag?');
			if (tag) utils.vgk.topol = new topol.rConjt(tag,[]);
			break;
	}
	utils.r$('topol').innerHTML =utils.o2s(utils.vgk.topol.meta);
}


function grabaTopol(tipo){
	switch (tipo){
		case 'CONJT' :
			ajax.grabaTopol(utils.vgk.topol);
			break;
	}
	console.log(utils.o2s(utils.vgk.topol));
}


function ecoCargaTopol(objDB){
	var iam = objDB.meta.iam;

	switch(iam){
		case 'rConjt':
			var t = new topol.rConjt('',[]);
			break;
	}

	t.objDB2Clase(objDB);
	console.log(utils.o2s(t));
	utils.r$('topol').innerHTML = utils.o2s(t.meta);
}

function cargaTopol(elem){
	console.log(elem.value);
	ajax.getTopol(elem.value,ecoCargaTopol)
}

function ecoListaTopols(objs){
	var form = utils.r$('lista');
	form.innerHTML = null;

	var select = document.createElement('select');
	select.onchange = function(){cargaTopol(select);};

	objs.map(function(obj,ix){
		var opt = document.createElement('option');
		opt.value = obj._id;
		opt.text = obj.meta.tag;
		select.appendChild(opt);
	})
	form.appendChild(select);
}

function listaTopol(tipo){

	switch (tipo){
		case 'CONJT' :
			ajax.listaTopols('rConjt',ecoListaTopols);
			break;
	}
}


function initTopol(){
	utils.vgk.user = {'org':'DEMO01','keo':''};
}

window.onload = initTopol;
window.nuevaTopol = nuevaTopol;
window.grabaTopol = grabaTopol;
window.listaTopol = listaTopol;
window.vgApp = vgApp;