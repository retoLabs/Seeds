
import {vgk}  from '/k1/libK1_Utils.js'

export var vgApp = {
	paramsXHR : {
		fase : 'alfa',
		url : 'http://' + window.location.host,
//		port : 3102,
		base : '/datos',
		otro : '',
		iam : '',
		eco : null
	},
	sqlite : {
		base   : '/shell/sqlite',
		userDB : 'usersSeeds.sqlite',
		sessDB : 'sessSeeds.sqlite',
		pathDB : 'apps/Seeds/sqlite',
		repoDB : 'repoSeeds.sqlite',
		notaDB : 'notasSeeds.sqlite',
		stmtDB : '',
	},
	cypher : {
		base   : '/shell/cypher',
		pathDB : 'apps/Seeds/sqlite',
	},
	encript : {
		base   : '/shell/encript',
	},
	clima : {
		base : '/shell/clima'
	}
}

export function goPag(pag,_id){
	if (vgk.params) var idSess = vgk.params.idSess;
	switch (pag){
	}
}

