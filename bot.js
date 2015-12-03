/**
 * HipChat Delete BOT
 *
 * @since 2015
 * @copyright Simon Sippert <s.sippert@sippsolutions.de>
 * @type {object}
 */
var deleteBot = {
    // stores jquery instance
    jq: null,

    /**
     * inits the bot
     */
    init: function () {
        deleteBot.jq = jQuery;
        deleteBot.action();
    },

    /**
     * search for messages and send them to remove action
     */
    action: function () {
        var forms = deleteBot.getForms();

        if (!forms.length) {
            deleteBot.goNext();
        } else {
            deleteBot.getForms().each(function (i, form) {
                deleteBot.remove(deleteBot.jq(form));
            });
        }
    },

    /**
     * Get all messages to delete
     */
    getForms: function () {
        return deleteBot.jq('.delete form');
    },

    /**
     * Remove them
     * @param {object} form
     */
    remove: function (form) {
        deleteBot.jq.ajax({
            method: 'POST',
            url: form.attr('action'),
            data: form.serialize(),
            success: function () {
                // remove dom element
                form.remove();

                // check additional forms
                if (!deleteBot.getForms().length) {
                    // go to next page
                    deleteBot.goNext();
                }
            }
        });
    },

    /**
     * Goes to next page
     */
    goNext: function () {
        var a, li = deleteBot.jq('.aui-nav-pagination .aui-nav-selected').next();
        if (li.length && li.is(':visible')) {
            a = li.find('a');
        } else {
            a = deleteBot.jq('.historynav .aui-button:first-child');
        }

        deleteBot.jq.ajax({
            url: a.attr('href'),
            success: function (html) {
                deleteBot.jq('html').html(html.replace(/<html(.*)>(.*)<\/html>/, "$2"));
                setTimeout(deleteBot.action, 80);
            }
        });
    }
};

// go :)
jQuery(deleteBot.init);
console.debug('Please close your console now to prevent slowing down your computer.');
