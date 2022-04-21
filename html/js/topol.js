
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


function borraTopol(tipo){
	switch (tipo){
		case 'CONJT' :
			ajax.borraTopol(utils.vgk.topolId);
			break;
	}
	console.log('Borrando ',utils.vgk.topolId);
}
//------------------------------------------------------------------- Edit

function addNodo(tipo){
	var nodo = null;
	switch (tipo){
		case 'CONJT' :
			var tag = prompt('Tag?');
			if (tag){
				nodo = new topol.rNodo(tag);
				utils.vgk.topol.addNodo(nodo);
			}
			break;
	}
	console.log('addNodo ',utils.o2s(nodo));

}
//------------------------------------------------------------------- Show

function showTopol(tipo){
	console.log('Show', tipo);
	switch(tipo){
		case 'CONJT':
			var nodos = utils.vgk.topol.getNodos();
			if (!nodos.length) utils.r$('show').innerHTML = 'Topol sin nodos';
			else {
				var txt = '';
				nodos.map(function(nodo){
					txt += nodo.tag;
				})
				utils.r$('show').innerHTML = txt;
			}
	}
}
//------------------------------------------------------------------- Ajax


function updateTopol(){
	var topol = utils.vgk.topol;
	var _id = utils.vgk.topolId;
	console.log(utils.o2s(topol.clase2ObjDB()));
	console.log(_id);
	ajax.updateTopol(topol,_id);
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
	utils.vgk.topolId = objDB._id;
	console.log('objDB.id:',utils.vgk.topolId);
	var iam = objDB.meta.iam;

	switch(iam){
		case 'rConjt':
			var t = new topol.rConjt('',[]);
			break;
	}

	t.objDB2Clase(objDB);
	utils.vgk.topol = t;
	console.log(utils.o2s(t));
	utils.r$('topol').innerHTML = utils.o2s(t.meta);
}

function cargaTopol(elem){
	console.log(elem.value);
	ajax.getTopol(elem.value,ecoCargaTopol);
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
window.borraTopol = borraTopol;
window.listaTopol = listaTopol;
window.showTopol  = showTopol;
window.updateTopol= updateTopol;
window.addNodo    = addNodo;
window.vgApp = vgApp;