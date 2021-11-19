# frozen_string_literal: true

require 'rails_helper'

class TestViewerClass
  def self.supported_types
    [:test_view]
  end
end

describe Embed do
  describe 'registering viewers' do
    it 'should have an array of registered_viewers' do
      expect(Embed.registered_viewers).to be_a(Array)
      expect(Embed.registered_viewers.count).to be > 1
      expect(Embed.registered_viewers).to include(Embed::Viewer::File)
    end
    it 'should allow viewers to be registered' do
      Embed.register_viewer(TestViewerClass)
      expect(Embed.registered_viewers).to be_a(Array)
      expect(Embed.registered_viewers).to include TestViewerClass
    end
    it 'should raise an error if a viewer registers itself w/ a supported type that is already registered' do
      expect { Embed.register_viewer(Embed.registered_viewers.first) }.to raise_error(Embed::DuplicateViewerRegistration)
    end
  end
end
