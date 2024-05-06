/*
{******************************************************************************}
{ Projeto: Componentes ACBr                                                    }
{  Biblioteca multiplataforma de componentes Delphi para interaÃ§Ã£o com equipa- }
{ mentos de AutomaÃ§Ã£o Comercial utilizados no Brasil                           }
{                                                                              }
{ Direitos Autorais Reservados (c) 2022 Daniel Simoes de Almeida               }
{                                                                              }
{ Colaboradores nesse arquivo: FÃ¡bio Francisco - Centrodata Sistemas,          }
{   Filipe Natividade - Centrodata Sistemas,                                   }
    Fernanda de Souza Alves - C E S Consultoria e Sistemas,                    }
    DÃ©bora Bonfim Guedes - C E S Consultoria e Sistemas	                      }
{                                                                              }
{  VocÃª pode obter a Ãºltima versÃ£o desse arquivo na pagina do  Projeto ACBr    }
{ Componentes localizado em      http://www.sourceforge.net/projects/acbr      }
{                                                                              }
{  Esta biblioteca Ã© software livre; vocÃª pode redistribuÃ­-la e/ou modificÃ¡-la }
{ sob os termos da LicenÃ§a PÃºblica Geral Menor do GNU conforme publicada pela  }
{ Free Software Foundation; tanto a versÃ£o 2.1 da LicenÃ§a, ou (a seu critÃ©rio) }
{ qualquer versÃ£o posterior.                                                   }
{                                                                              }
{  Esta biblioteca Ã© distribuÃ­da na expectativa de que seja Ãºtil, porÃ©m, SEM   }
{ NENHUMA GARANTIA; nem mesmo a garantia implÃ­cita de COMERCIABILIDADE OU      }
{ ADEQUAÃ‡ÃƒO A UMA FINALIDADE ESPECÃFICA. Consulte a LicenÃ§a PÃºblica Geral Menor}
{ do GNU para mais detalhes. (Arquivo LICENÃ‡A.TXT ou LICENSE.TXT)              }
{                                                                              }
{  VocÃª deve ter recebido uma cÃ³pia da LicenÃ§a PÃºblica Geral Menor do GNU junto}
{ com esta biblioteca; se nÃ£o, escreva para a Free Software Foundation, Inc.,  }
{ no endereÃ§o 59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.          }
{ VocÃª tambÃ©m pode obter uma copia da licenÃ§a em:                              }
{ http://www.opensource.org/licenses/lgpl-license.php                          }
{                                                                              }
{ Daniel SimÃµes de Almeida - daniel@projetoacbr.com.br - www.projetoacbr.com.br}
{       Rua Coronel Aureliano de Camargo, 963 - TatuÃ­ - SP - 18270-170         }
{******************************************************************************}
*/

/* 
  Data: 06/05/2024
  Como Utilizar a DEMO
  Pegue a DLL que você deseja altere a variavel acbrDLL e coloque na mesma pasta do diretorio
  Coloque sua nfe no arquivo raiz e altere a variavel notaFiscal com o nome do arquivo
  Crie uma pasta chamada certificado e coloque seu arquivo pfx lá depois modifique a variavel pfx com o nome do arquivo e coloque a senha em senhaPfx
  Também adicione as dlls no arquivo raiz libexslt.dll libiconv.dll libxml2.dll libxslt.dll
  Por favor veja o manual de respostas em https://acbr.sourceforge.io/ACBrLib/ACBrLibNFe.html
*/

import path from 'path';
import ffi from 'ffi-napi';
import ref from 'ref-napi';

enum ESSLCryptLib {
  'cryNone' = '0',
  'cryOpenSSL' = '1',
  'cryCapicom' = '2',
  'cryWinCrypt' = '3',
}
enum ESSLHttpLib {
  'httpNone' = '0',
  'httpWinINet' = '1',
  'httpWinHttp' = '2',
  'httpOpenSSL' = '3',
  'httpIndy' = '4',
}
enum EFormaEmissao {
  'teNormal' = '0',
  'teContingencia' = '1',
  'teSCAN' = '2',
  'teDPEC' = '3',
  'teFSDA' = '4',
  'teSVCAN' = '5',
  'teSVCRS' = '6',
  'teSVCSP' = '7',
  'teOffLine' = '8',
}
enum EVersaoDF {
  've200' = '0',
  've300' = '1',
  've310' = '2',
  've400' = '3',
}
enum EModeloDF {
  'moNFe' = '0',
  'moNFCe' = '1',
}
enum EVersaoQRCode {
  'veqr000' = '0',
  'veqr100' = '1',
  'veqr200' = '2',
}
enum ESSLType {
  'LT_all' = '0',
  'LT_SSLv2' = '1',
  'LT_SSLv3' = '2',
  'LT_TLSv1' = '3',
  'LT_TLSv1_1' = '4',
  'LT_TLSv1_2' = '5',
  'LT_SSHv2' = '6',
}
enum ESSLXmlSignLib {
  'xsNone' = '0',
  'xsXmlSec' = '1',
  'xsMsXml' = '2',
  'xsMsXmlCapicom' = '3',
  'xsLibXml2' = '4',
}

const notaFiscal = 'notafiscal.xml';
const pfx = 'meu.pfx';
const senhaPfx = 'senhadopfx';

const acbrDLL = 'ACBrNFe64.dll';
const estado = 'SC';

var pathDllACBrLibNFe = path.join(path.resolve(__dirname, 'acbr'), acbrDLL);
var pathXML = path.join(path.resolve(__dirname, 'notafiscal'), notaFiscal);
var eArqConfig = path.join(path.resolve(__dirname, 'acbr'), 'acbrlib.ini');

var eChaveCrypt = '';

async function getNFe() {
  var libm = ffi.Library(pathDllACBrLibNFe, {
    //MÃ©todos da Biblioteca

    // NFE_Inicializar([eArqConfig, eChaveCrypt]);
    NFE_Inicializar: ['int', ['string', 'string']],
    // NFE_Finalizar();
    NFE_Finalizar: ['int', []],
    // NFE_UltimoRetorno(sMensagem, ref esTamanho);
    NFE_UltimoRetorno: ['int', ['string', 'string']],
    // NFE_Nome(sNome, ref esTamanho);
    NFE_Nome: ['int', ['string', 'string']],
    // NFE_Versao(sVersao, ref esTamanho);
    NFE_Versao: ['int', ['string', 'string']],

    //MÃ©todos de ConfiguraÃ§Ã£o

    // NFE_ConfigLer([eArqConfig]);
    NFE_ConfigLer: ['int', ['string']],
    // NFE_ConfigGravar([eArqConfig]);
    NFE_ConfigGravar: ['int', ['string']],
    // NFE_ConfigLerValor(eSessao, eChave, sValor, esTamanho);
    NFE_ConfigLerValor: ['int', ['string', 'string', 'string', 'string']],
    // NFE_ConfigGravarValor(eSessao, eChave, sValor);
    NFE_ConfigGravarValor: ['int', ['string', 'string', 'string']],
    // NFE_ConfigImportar([eArqConfig]);
    NFE_ConfigImportar: ['int', ['string']],
    // NFE_ConfigExportar(sMensagem, ref esTamanho);
    NFE_ConfigExportar: ['int', ['string', 'string']],

    //MÃ©todos NFe

    // NFE_CarregarXML(eArquivoOuXML);
    NFE_CarregarXML: ['int', ['string']],
    // NFE_CarregarINI(eArquivoOuINI);
    NFE_CarregarINI: ['int', ['string']],
    // NFE_ObterXml(AIndex, sResposta, esTamanho);
    NFE_ObterXml: ['int', ['int', 'string', 'string']],
    // NFE_GravarXml(AIndex, [eNomeArquivo], [ePathArquivo]);
    NFE_GravarXml: ['int', ['int', 'string', 'string']],
    // NFE_ObterIni(AIndex, sResposta, esTamanho);
    NFE_ObterIni: ['int', ['int', 'string', 'string']],
    // NFE_GravarIni(AIndex, eNomeArquivo, [ePathArquivo]);
    NFE_GravarIni: ['int', ['int', 'string', 'string']],
    // NFE_CarregarEventoXML(eArquivoOuXML);
    NFE_CarregarEventoXML: ['int', ['string']],
    // NFE_CarregarEventoINI(eArquivoOuINI);
    NFE_CarregarEventoINI: ['int', ['string']],
    // NFE_LimparLista();
    NFE_LimparLista: ['int', []],
    // NFE_LimparListaEventos();
    NFE_LimparListaEventos: ['int', []],
    // NFE_Assinar();
    NFE_Assinar: ['int', []],
    // NFE_Validar();
    NFE_Validar: ['int', []],
    // NFE_ValidarRegrasdeNegocios(sResposta, esTamanho);
    NFE_ValidarRegrasdeNegocios: ['int', ['string', 'string']],
    // NFE_VerificarAssinatura(sResposta, esTamanho);
    NFE_VerificarAssinatura: ['int', ['string', 'string']],
    // NFE_GerarChave(ACodigoUF, ACodigoNumerico, AModelo, ASerie, ANumero, ATpEmi, AEmissao, ACNPJCPF, sResposta, esTamanho);
    NFE_GerarChave: [
      'int',
      [
        'int',
        'int',
        'int',
        'int',
        'int',
        'int',
        'string',
        'string',
        'string',
        'string',
      ],
    ],
    // NFE_ObterCertificados(sResposta, esTamanho);
    NFE_ObterCertificados: ['int', ['string', 'string']],
    // NFE_GetPath(ATipo, sResposta, esTamanho);
    NFE_GetPath: ['int', ['int', 'string', 'string']],
    // NFE_GetPathEvento(ACodEvento, sResposta, esTamanho);
    NFE_GetPathEvento: ['int', ['int', 'string', 'string']],
    // NFE_StatusServico(sResposta, esTamanho);
    NFE_StatusServico: ['int', ['string', 'string']],
    // NFE_Consultar( eChaveOuNFe, AExtrairEventos, sResposta, esTamanho);
    NFE_Consultar: ['int', ['string', 'bool', 'string', 'string']],
    // NFE_ConsultarRecibo(ARecibo, sResposta, esTamanho);
    NFE_ConsultarRecibo: ['int', ['string', 'string', 'string']],
    // NFE_ConsultaCadastro(cUF, nDocumento, nIE, sResposta, esTamanho);
    NFE_ConsultaCadastro: [
      'int',
      ['string', 'string', 'bool', 'string', 'string'],
    ],
    // NFE_Inutilizar(ACNPJ, AJustificativa, Ano, Modelo, Serie, NumeroInicial, NumeroFinal, sResposta, esTamanho);
    NFE_Inutilizar: [
      'int',
      [
        'string',
        'string',
        'int',
        'int',
        'int',
        'int',
        'int',
        'string',
        'string',
      ],
    ],
    // NFE_Enviar( (ALote, AImprimir, ASincrono, AZipado, sResposta, esTamanho);
    NFE_Enviar: ['int', ['int', 'bool', 'bool', 'bool', 'string', 'string']],
    // NFE_Cancelar(eChave, eJustificativa, eCNPJ, ALote, sResposta, esTamanho);
    NFE_Cancelar: [
      'int',
      ['string', 'string', 'string', 'int', 'string', 'string'],
    ],
    // NFE_EnviarEvento(idLote, sResposta, esTamanho);
    NFE_EnviarEvento: ['int', ['int', 'string', 'string']],
    // NFE_DistribuicaoDFePorUltNSU(AcUFAutor, eCNPJCPF, eultNSU, sResposta, esTamanho);
    NFE_DistribuicaoDFePorUltNSU: [
      'int',
      ['int', 'string', 'string', 'string', 'string'],
    ],
    // NFE_DistribuicaoDFePorNSU(AcUFAutor, eCNPJCPF, eNSU, sResposta, esTamanho);
    NFE_DistribuicaoDFePorNSU: [
      'int',
      ['int', 'string', 'string', 'string', 'string'],
    ],
    // NFE_DistribuicaoDFePorChave(AcUFAutor, eCNPJCPF, eChave, sResposta, esTamanho);
    NFE_DistribuicaoDFePorChave: [
      'int',
      ['int', 'string', 'string', 'string', 'string'],
    ],
    // NFE_EnviarEmail(ePara, eXMLNFe, AEnviaPDF, eAssunto, eCC, eAnexos, eMensagem);
    NFE_EnviarEmail: [
      'int',
      ['string', 'string', 'bool', 'string', 'string', 'string', 'string'],
    ],
    // NFE_EnviarEmailEvento(ePara, eChaveEvento, eChaveNFe, AEnviaPDF, eAssunto, eCC, eAnexos, eMensagem);
    NFE_EnviarEmailEvento: [
      'int',
      [
        'string',
        'string',
        'string',
        'bool',
        'string',
        'string',
        'string',
        'string',
      ],
    ],
    // NFE_Imprimir([cImpressora], [nNumCopias], [cProtocolo], [bMostrarPreview], [cMarcaDagua], [bViaConsumidor], [bSimplificado]);
    NFE_Imprimir: [
      'int',
      ['string', 'int', 'string', 'string', 'string', 'string', 'string'],
    ],
    // NFE_ImprimirPDF();
    NFE_ImprimirPDF: ['int', []],
    // NFE_SalvarPDF(sResposta, esTamanho);
    NFE_SalvarPDF: ['int', ['string', 'string']],
    // NFE_ImprimirEvento(eArquivoXmlNFe, eArquivoXmlEvento);
    NFE_ImprimirEvento: ['int', ['string', 'string']],
    // NFE_ImprimirEventoPDF(eArquivoXmlNFe, eArquivoXmlEvento);
    NFE_ImprimirEventoPDF: ['int', ['string', 'string']],
    // NFE_SalvarEventoPDF(eArquivoXmlNFe, eArquivoXmlEvento);
    NFE_SalvarEventoPDF: ['int', ['string', 'string']],
    // NFE_ImprimirInutilizacao(eArquivoXml);
    NFE_ImprimirInutilizacao: ['int', ['string']],
    // NFE_ImprimirInutilizacaoPDF(eArquivoXml);
    NFE_ImprimirInutilizacaoPDF: ['int', ['string']],
    // NFE_SalvarInutilizacaoPDF(eArquivoXml);
    NFE_SalvarInutilizacaoPDF: ['int', ['string']],
  });

  var inicio = 2;
  const buflength = 256;

  let aloc_sResposta = Buffer.alloc(buflength);
  let aloc_esTamanho = ref.alloc('int', buflength);

  inicio = libm.NFE_Inicializar(eArqConfig, eChaveCrypt);
  console.log(`inicio >>>> ${inicio}`);

  inicio = libm.NFE_ConfigGravarValor('NFe', 'ModeloDF', EModeloDF.moNFCe);
  inicio = libm.NFE_ConfigGravarValor('NFe', 'VersaoDF', EVersaoDF.ve400);
  inicio = libm.NFE_ConfigGravarValor(
    'NFe',
    'VersaoQRCode',
    EVersaoQRCode.veqr200
  );

  inicio = libm.NFE_ConfigGravarValor('NFe', 'SSLType', ESSLType.LT_TLSv1_2);
  inicio = libm.NFE_ConfigGravarValor(
    'NFe',
    'FormaEmissao',
    EFormaEmissao.teNormal
  );
  inicio = libm.NFE_ConfigGravarValor('NFe', 'Visualizar', '0');

  inicio = libm.NFE_ConfigGravarValor(
    'DFe',
    'ArquivoPFX',
    path.join(path.resolve(__dirname, 'certificado'), pfx)
  );

  inicio = libm.NFE_ConfigGravarValor('DFe', 'Senha', senhaPfx);
  inicio = libm.NFE_ConfigGravarValor(
    'DFe',
    'SSLCryptLib',
    ESSLCryptLib.cryWinCrypt
  );
  inicio = libm.NFE_ConfigGravarValor('DFe', 'UF', estado);
  inicio = libm.NFE_ConfigGravarValor(
    'DFe',
    'SSLXMLSignLib',
    ESSLXmlSignLib.xsLibXml2
  );
  inicio = libm.NFE_ConfigGravarValor(
    'DFe',
    'SSLHttpLib',
    ESSLHttpLib.httpWinHttp
  );
  inicio = libm.NFE_ConfigGravarValor(
    'NFe',
    'PathSchemas',
    path.resolve(__dirname, 'Schemas', 'NFe')
  );

  inicio = libm.NFE_CarregarXML(pathXML);
  console.log(`carregar xml >>>>>>> ${inicio}`);

  inicio = libm.NFE_UltimoRetorno(
    aloc_sResposta as unknown as string,
    aloc_esTamanho
  );
  console.log(`ultmio retorno >>>>>>>> ${inicio}`);
  console.log(`Mensagem Ultimo Retorno: `, aloc_sResposta.toString());

  inicio = libm.NFE_Assinar();
  console.log(`assinar xml >>>>>>> ${inicio}`);

  aloc_sResposta = Buffer.alloc(buflength);
  aloc_esTamanho = ref.alloc('int', buflength);

  inicio = libm.NFE_UltimoRetorno(
    aloc_sResposta as unknown as string,
    aloc_esTamanho
  );
  console.log(`ultimo retorno apos assinar >>>>>>>> ${inicio}`);
  console.log(`Mensagem: `, aloc_sResposta.toString('ascii'));

  inicio = libm.NFE_Validar();
  console.log(`validar xml >>>>>>> ${inicio}`);

  aloc_sResposta = Buffer.alloc(buflength);
  aloc_esTamanho = ref.alloc('int', buflength);

  inicio = libm.NFE_UltimoRetorno(
    aloc_sResposta as unknown as string,
    aloc_esTamanho
  );
  console.log(`ultmio retorno apos validar >>>>>>>> ${inicio}`);

  inicio = libm.NFE_Finalizar();
  console.log(`finalizar >>>>>>>> ${inicio}`);
}

getNFe();
