# frozen_string_literal: true

require 'rails_helper'

describe 'file viewer search bar', js: true do
  include PurlFixtures
  it 'should limit shown files when text is entered' do
    stub_purl_response_with_fixture(file_purl)
    visit_iframe_response('abc123', min_files_to_search: 1)
    expect(page).to have_css('.sul-embed-count', count: 1)
    expect(page).to have_css '.sul-embed-item-count', text: '1 item'
    fill_in 'sul-embed-search-input', with: 'test'
    expect(page).to_not have_css('.sul-embed-count')
    expect(page).to have_css '.sul-embed-item-count', text: '0 items'
  end
  it 'should not display the search box when the number of files are beneath the threshold' do
    stub_purl_response_with_fixture(file_purl)
    visit_iframe_response
    expect(page).to_not have_css('.sul-embed-search-input')
  end
  it 'should hide the search box when requested' do
    stub_purl_response_with_fixture(file_purl)
    visit_iframe_response('abc123', hide_search: true)
    expect(page).to_not have_css('.sul-embed-search')
  end
end
