/**
 * Popover Directive.  Wraps the AngularStrap popover and
 *     1) Allows the popover to stay open when hovering / focusing the contents.
 *        If the popover was only triggered by 'hover' or 'focus', it closes as soon
 *        as the mouse leaves or focus is lost on the triggering element.
 *
 *     2) Lazy initializes the popover until it's needed.  This reduces the
 *        amount of scope.
 *
 *     3) When the popover closes, cleans up the AngularStrap popover memory leak
 *        caused by using directives for popover content.
 */
angular.module('trialsReportApp')
	.directive('accessibleContentsPopover', ['$popover', '$timeout', function ($popover, $timeout) {
    return {
        restrict: 'A',
        //scope: true,
        link: function (scope, elem, attrs) {
            var options = {},
                popover,
                popoverElement,
                openPopoverTimeout,
                closePopoverTimeout;

            // Move the attributes into our own
            // object and link the scopes together
            angular.extend(options, attrs);
            options.scope = scope;

            function cancelTimers() {
                if (openPopoverTimeout) {
                    $timeout.cancel(openPopoverTimeout);
                }

                if (closePopoverTimeout) {
                     $timeout.cancel(closePopoverTimeout);
                }
            }

            function unbindPopoverElementEvents() {
                if (popoverElement) {
                    popoverElement.off('mouseenter').off('focusin').off('mouseleave').off('focusout');
                }
            }

            function destroyPopover() {
                if (popover) {
                    popover.hide(); // allow animation leave
                    popover = undefined;
                }
                popoverElement = undefined;
            }

            function delayClose() {
                // Cancel any other timers
                cancelTimers();

                // Start the clock
                closePopoverTimeout = $timeout(function () {
                    unbindPopoverElementEvents();
                    destroyPopover();
                }, 250);
            }

            function openPopover(delay) {
                cancelTimers();

                // Create the popover
                if (!popover) {
                    openPopoverTimeout = $timeout(function () {
                        popover = $popover(elem, options);

                        // Could be using an external template, need to wrap in promise
                        popover.$promise.then(function () {
                            // Show the popover after digest
                            scope.$$postDigest(function() {
                              popover.show();

                              // Grab a reference to the popover contents
                              popoverElement = popover.$element;

                              // When mousing or focusing inside the contents,
                              // cancel the closing of the popover
                              popoverElement.on('mouseenter', cancelTimers);
                              popoverElement.on('focusin', cancelTimers);

                              // When leaving the popover's contents, start the
                              // close process
                              popoverElement.on('mouseleave', delayClose);
                              popoverElement.on('focusout', delayClose);
                          });
                        });
                    }, delay);
                }
            }

            // On mouseenter or focus, open the popover
            elem.on('mouseenter', function () { openPopover(250); });
            elem.on('focus', function () { openPopover(750); });

            // When we leave the trigger element
            // start the close process
            elem.on('mouseleave', delayClose);
            elem.on('blur', delayClose);

            // Clean up any timers and event handlers
            // when the directive is destroyed
            scope.$on('$destroy', function () {
                cancelTimers();
                elem.off('mouseenter').off('focus').off('mouseleave').off('blur');
                unbindPopoverElementEvents();
                destroyPopover();
            });
        }
    };
  }]);
