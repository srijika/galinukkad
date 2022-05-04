import React, { Component } from 'react';

class ProductRefund extends Component {
    render() {
        return (
            <div className="a-section page-content-container">
        <div className="a-row a-spacing-double-large a-spacing-top-extra-large spr-page-primary-sections">
          <div className="a-column a-span8">
            <div id="itemsSection" className="a-section a-spacing-none">
              <div className="a-row a-spacing-small">
                <div className="a-column a-span12 a-color-base-background">
                  <div className="a-section a-padding-medium">
                    <div id="items-section-expanded-view" data-item-key-to-returnability-group-map-json="{}" className="a-section">
                      <div id="items-section-expanded-view-celWidget" className="celwidget" cel_widget_id="items-section-expanded-view" data-csa-c-id="apg8g7-ug8p56-1hujdo-45foi4" data-cel-widget="items-section-expanded-view">
                        <div className="a-section">
                          <h1>
                            Choose items to return
                          </h1>
                        </div>
                        <div className="a-popover-preload" id="a-popover-cancel-return-modal-view">
                          <div id="cancel-return-initiation-section" className="a-section a-spacing-mini">
                            <div className="a-section a-text-left">
                              <span className="a-size-base">
                                Cancel this return if you need to reschedule your pickup, make changes to your return or if you no longer wish to return the product. You can start a new return after this one is cancelled.
                              </span>
                            </div>
                            <div className="a-section a-text-left">
                              <span className="a-size-base">
                                If you have already shipped your return item, we will not be able to cancel your return.
                              </span>
                            </div>
                            <div className="a-section a-text-right">
                              <span id="go-back-button" className="a-button a-button-base"><span className="a-button-inner"><input data-customer-event-attributes className="a-button-input" type="submit" aria-labelledby="go-back-button-announce" /><span id="go-back-button-announce" className="a-button-text" aria-hidden="true">
                                    <span>
                                      Go back
                                    </span>
                                  </span></span></span>
                              <span id="cancel-return-button" className="a-button a-button-primary"><span className="a-button-inner"><input data-customer-event-attributes className="a-button-input" type="submit" aria-labelledby="cancel-return-button-announce" /><span id="cancel-return-button-announce" className="a-button-text" aria-hidden="true">
                                    <span>
                                      Cancel return
                                    </span>
                                  </span></span></span>
                            </div>
                          </div>
                          <div id="cancel-return-popover-spinner" className="a-section a-text-center aok-hidden">
                            <span className="a-spinner a-spinner-medium" />
                          </div>
                          <div id="cancel-return-confirmation-section" className="a-section aok-hidden">
                            <span>
                              Your return has been canceled. If you requested a pickup for your return, you can ignore the pickup attempt(s).
                            </span>
                          </div>
                        </div>
                        <form id="itemSectionForm" method="post" action="/spr/returns/resolutions?ref_=orc_spr_spr_itms_cont" className="itemSectionForm">
                          <input type="hidden" name="anti-csrftoken-a2z" defaultValue="gyif1U86TWamgWmjdp3RKnmRzAq6EmkGfde/RReaPas+AAAAAQAAAABgC/g9cmF3AAAAAJyIEDW/E9xfqJT7XVH8kQ==" />
                          <div id="returning-items-section" className="a-section">
                            <div id="-returnable-item" className="a-section">
                              <div className="a-row">
                                <div className="a-column a-span1">
                                </div>
                                <div data-item-key className="a-column a-span6">
                                  <div className="a-row a-grid-vertical-align a-grid-center">
                                    <div className="a-column a-span3">
                                      <div className="a-section a-padding-mini a-text-center">
                                        <div className="a-row">
                                          <img alt="Unable to load image" src="https://m.media-amazon.com/images/I/51SzuBLrm+L._AC_._SS160_.jpg" />
                                        </div>
                                        <div className="a-row">
                                          <span className="a-declarative" data-action="a-popover" data-a-popover="{&quot;dataStrategy&quot;:&quot;preload&quot;,&quot;closeButton&quot;:&quot;false&quot;,&quot;name&quot;:&quot;ea5c64e8-9049-45a9-9a62-acbc390708d5-item-details&quot;,&quot;activate&quot;:&quot;onmouseover&quot;,&quot;header&quot;:&quot;&quot;,&quot;position&quot;:&quot;triggerVertical&quot;,&quot;url&quot;:&quot;&quot;}">
                                            <a href="javascript:void(0)" className="a-popover-trigger a-declarative">
                                              <span className="a-size-small">
                                                Details
                                              </span>
                                              <i className="a-icon a-icon-popover" /></a>
                                          </span>
                                          <div className="a-popover-preload" id="a-popover-ea5c64e8-9049-45a9-9a62-acbc390708d5-item-details">
                                            <div className="a-section a-spacing-small a-text-left">
                                              <span className="a-size-medium a-text-bold">
                                                Galaxy Body Fat Caliper Tester with Fat...
                                              </span>
                                            </div>
                                            <div className="a-row">
                                            </div>
                                            <div className="a-row">
                                            </div>
                                            <div className="a-row">
                                              <span className="a-size-small">
                                                Order #: 
                                              </span>
                                              <span className="a-size-small">
                                                406-4355023-8761951
                                              </span>
                                            </div>
                                            <div className="a-row">
                                              <span className="a-size-small">
                                                Sold by: 
                                              </span>
                                              <span className="a-size-small">
                                                Galaxy Retail Inc
                                              </span>
                                            </div>
                                            <div className="a-row">
                                              <span className="a-size-small">
                                                Quantity: 
                                              </span>
                                              1
                                            </div>
                                            <div className="a-row">
                                              <span className="a-size-small">
                                                Item price: 
                                              </span>
                                              <span className="a-size-small">
                                                ₹&nbsp;195.00
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="a-column a-span8 a-spacing-top-small a-span-last">
                                      <div className="a-row">
                                        <span className="a-size-base a-text-bold">Galaxy Body Fat Caliper Tester with Fat...</span>
                                      </div>
                                      <div className="a-row">
                                      </div>
                                      <div className="a-row">
                                      </div>
                                      <div className="a-row">
                                        <span className="a-size-small">
                                          ₹&nbsp;195.00
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="a-column a-span5 a-span-last">
                                  <div className="a-section">
                                    <div className="a-row">
                                      <div className="a-box a-alert-inline a-alert-inline-warning a-spacing-base a-spacing-top-mini"><div className="a-box-inner a-alert-container"><h4 className="a-alert-heading">This item is no longer eligible for return.</h4><i className="a-icon a-icon-alert" /><div className="a-alert-content">
                                            <span className="a-size-base">
                                              The return window closed on Oct 18, 2020.
                                            </span>
                                          </div></div></div>
                                    </div>
                                    <span className="a-button a-spacing-base a-button-base" id="a-autoid-0"><span className="a-button-inner"><a href="/gp/help/customer/display.html?nodeId=201149900&ref_=itm_retpol_nonret_oorw_364" data-customer-event-attributes className="a-button-text" role="button" id="a-autoid-0-announce">
                                          <span>
                                            SEE RETURN POLICY
                                          </span>
                                        </a></span></span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                      <span id="number-of-items-message" className="a-color-secondary aok-hidden">
                        Showing <span id="showingItemsCount" /> returnable items
                      </span>
                      <span id="why-items-not-visible" className="aok-hidden">
                        <span className="a-color-secondary"> | </span>
                        <span className="a-declarative" data-action="a-popover" data-a-popover="{&quot;dataStrategy&quot;:&quot;preload&quot;,&quot;closeButton&quot;:&quot;false&quot;,&quot;name&quot;:&quot;why-are-items-filtered-out-popover&quot;,&quot;activate&quot;:&quot;onmouseover&quot;,&quot;header&quot;:&quot;&quot;,&quot;position&quot;:&quot;triggerVertical&quot;,&quot;url&quot;:&quot;&quot;}">
                          <a href="javascript:void(0)" className="a-popover-trigger a-declarative">
                            <span className="a-color-link">
                              Why don't I see all of my items?
                            </span>
                            <i className="a-icon a-icon-popover" /></a>
                        </span>
                        <div className="a-popover-preload" id="a-popover-why-are-items-filtered-out-popover">
                          <div className="a-section a-text-left">
                            <span className="a-color-base">
                              Unfortunately, not all items can be shipped together in a return box. These include items that:
                            </span>
                          </div>
                          <div id="why-items-were-filtered-out-reason-list" className="a-section" />
                          <div className="a-section a-text-left">
                            <span className="a-color-base">
                              You may still return these items from Your Orders. Review our return policy for more information.
                            </span>
                          </div>
                        </div>
                      </span>
                      <div className="a-row a-spacing-small return-center-auxiliary-section">
                        <div className="a-section a-padding-small">
                        </div>
                      </div>
                      <div id="see-more-items-spinner-section" className="a-spinner-wrapper aok-hidden"><span className="a-spinner a-spinner-medium" /></div>
                    </div>
                    <div id="items-section-collapsed-view" className="a-row aok-hidden">
                      <div id="single-item-items-collapsed-section" className="a-row aok-hidden">
                      </div>
                      <div id="item-collapsed-section-bottom-sheet-trigger" className="a-row aok-hidden">
                        <div className="a-column a-span5">
                          <div className="a-section a-spacing-mini">
                            <h3 className="a-text-left">
                              Why are you returning these?
                            </h3>
                          </div>
                        </div>
                        <div className="a-column a-span5 a-pull2 a-span-last">
                          <span className="a-declarative" data-action="a-modal" data-a-modal="{&quot;cache&quot;:&quot;false&quot;,&quot;dataStrategy&quot;:&quot;preload&quot;,&quot;closeButton&quot;:&quot;true&quot;,&quot;name&quot;:&quot;items-collapsed-modal&quot;,&quot;activate&quot;:&quot;onclick&quot;,&quot;width&quot;:&quot;500&quot;,&quot;header&quot;:&quot;See Details&quot;,&quot;url&quot;:&quot;&quot;}">
                            <a href="javascript:void(0)" className="a-popover-trigger a-declarative">
                              See Details
                              <i className="a-icon a-icon-popover" /></a>
                          </span>
                          <div className="a-popover-preload" id="a-popover-items-collapsed-modal">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div id="resolutionsSection" className="a-section a-spacing-none">
            </div>
            <div id="methodsSection" className="a-section a-spacing-none">
            </div>
            <div id="spinner-section" className="a-section a-spacing-none aok-hidden">
              <div className="a-row a-spacing-mini">
                <div className="a-column a-span12 a-color-base-background">
                  <div className="a-section a-padding-medium a-text-center">
                    <div className="a-spinner-wrapper"><span className="a-spinner a-spinner-medium" /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="a-column a-span4 a-span-last">
            <div id="summary-section" className="a-section" style={{position: 'absolute', width: '383px'}}>
              <div id="summary-section-content" className="a-section a-spacing-none">
                <div id="summary-section-content-v1" className="a-section a-spacing-none">
                  <div className="a-row a-spacing-small">
                    <div className="a-column a-span12 a-color-base-background">
                      <div className="a-section a-padding-medium">
                        <div className="a-row">
                          <div className="a-column a-span12 a-color-base-background">
                            <div className="a-section a-padding-small">
                              <div id="items-continue-section" className="a-row">
                                <div id="items-continue-button-section" className="a-row aok-hidden">
                                  <span id="items-section-continue-button" className="a-button a-button-disabled a-spacing-small a-button-span12 a-button-primary prex-continue-button"><span className="a-button-inner"><input data-form-id="itemSectionForm" disabled className="a-button-input" type="submit" aria-labelledby="items-section-continue-button-announce" /><span id="items-section-continue-button-announce" className="a-button-text" aria-hidden="true">
                                        Continue
                                      </span></span></span>
                                </div>
                                <div className="a-row">
                                  <div className="a-section">
                                    <span className="a-button a-button-span12 a-button-primary" id="a-autoid-1"><span className="a-button-inner"><a href="/?ref_=orc_spr_itms_cnshp" className="a-button-text" role="button" id="a-autoid-1-announce">
                                          Continue shopping
                                        </a></span></span>
                                  </div>
                                </div>
                                <div className="a-row a-spacing-large aok-hidden">
                                </div>
                              </div>
                              <div id="resolutions-continue-section" className="a-row aok-hidden">
                                <div id="resolutions-continue-button-section" className="a-row aok-hidden">
                                  <span id="resolutions-section-continue-button" className="a-button a-button-disabled a-spacing-small a-button-span12 a-button-primary prex-continue-button"><span className="a-button-inner"><input data-form-id="resolutionSectionForm" disabled="disabled" className="a-button-input" type="submit" aria-labelledby="resolutions-section-continue-button-announce" /><span id="resolutions-section-continue-button-announce" className="a-button-text" aria-hidden="true">
                                        SUBMIT RETURN REQUEST
                                      </span></span></span>
                                </div>
                                <div id="resolutions-section-continue-shopping-button" className="a-row">
                                  <div className="a-section">
                                    <span className="a-button a-button-span12 a-button-primary" id="a-autoid-2"><span className="a-button-inner"><a href="/?ref_=orc_spr_itms_cnshp" className="a-button-text" role="button" id="a-autoid-2-announce">
                                          Continue shopping
                                        </a></span></span>
                                  </div>
                                </div>
                              </div>
                              <div id="methods-continue-section" className="a-row aok-hidden">
                                <div id="methods-e-invoice-ack-checkbox" className="a-row">
                                </div>
                                <div id="methods-continue-button-section" className="a-row aok-hidden">
                                  <span id="methods-section-continue-button" className="a-button a-button-disabled a-spacing-small a-button-span12 a-button-primary prex-continue-button"><span className="a-button-inner"><input data-form-id="methodSectionForm" disabled="disabled" className="a-button-input" type="submit" aria-labelledby="methods-section-continue-button-announce" /><span id="methods-section-continue-button-announce" className="a-button-text" aria-hidden="true">
                                        CONFIRM YOUR RETURN
                                      </span></span></span>
                                </div>
                                <div id="methods-section-continue-shopping-button" className="a-row a-spacing-medium a-spacing-top-medium">
                                  <div className="a-section">
                                    <span className="a-button a-button-span12 a-button-primary" id="a-autoid-3"><span className="a-button-inner"><a href="/?ref_=orc_spr_itms_cnshp" className="a-button-text" role="button" id="a-autoid-3-announce">
                                          Continue shopping
                                        </a></span></span>
                                  </div>
                                </div>
                                <div className="a-row a-spacing-large">
                                  <div className="a-section a-text-left">
                                    <span>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <hr id="summary-section-divider-for-ledger" aria-hidden="true" className="a-divider-normal aok-hidden" />
                      </div>
                    </div>
                  </div>
                </div>
                <div id="summary-section-content-v2" className="a-section aok-hidden">
                </div>
              </div>
              <div id="summary-section-spinner" className="a-section a-text-center aok-hidden">
                <div className="a-row a-spacing-mini">
                  <div className="a-column a-span12 a-color-base-background">
                    <div className="a-section a-padding-medium">
                      <span className="a-spinner a-spinner-medium" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        );
    }
}

export default ProductRefund;
