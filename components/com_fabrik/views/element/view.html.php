<?php

/**
 * @package     Joomla
 * @subpackage	Fabik
 * @copyright	Copyright (C) 2005 - 2008 Pollen 8 Design Ltd. All rights reserved.
 * @license		GNU/GPL
 */

// Check to ensure this file is included in Joomla!
defined('_JEXEC') or die();

jimport('joomla.application.component.view');

class FabrikViewElement extends JViewLegacy
{

	var $id = null;

	function setId($id)
	{
		$this->id = $id;
	}

	/**
	 * display the template
	 *
	 * @param sting $tpl
	 */

	function display($tpl = null)
	{
		echo "display";exit;
	/* 	FabrikHelperHTML::framework();
		$element = JRequest::getVar('element');
		$elementid = JRequest::getVar('elid');
		$pluginManager = JModel::getInstance('Pluginmanager', 'FabrikFEModel');
		$className = JRequest::getVar('plugin');
		$plugin = $pluginManager->getPlugIn($className, 'element');
		if (JError::isError($plugin)) {
			JError::handleMessage($plugin);
			return;
		}
		$plugin->setId($elementid);
		$data = array();
		$repeatCounter = 0;
		$groupModel = $plugin->getGroup();
		$srcs = array();
		$plugin->formJavascriptClass($srcs);
		FabrikHelperHTML::script($srcs);
		$html = '<script>';
		$html .= $plugin->elementJavascript($repeatCounter);
		$html .= '</script>';
		 $html .= $plugin->preRenderElement($data, $repeatCounter, $groupModel);
		echo $html; */
	}

}
